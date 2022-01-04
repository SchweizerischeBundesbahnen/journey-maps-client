import {Injectable} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {FeatureLayerConfig} from '../model/feature-layer-config';
import {HttpClient} from '@angular/common/http';
import {expand, map, reduce} from 'rxjs/operators';
import {FeatureLayerOptions} from '../model/feature-layer-options';

@Injectable({
  providedIn: 'root'
})

export class FeatureLayerService {

  private readonly wgs84wkid = '4326';

  constructor(private http: HttpClient) {
  }

  getFeatureLayerConfig(options: FeatureLayerOptions): Observable<FeatureLayerConfig> {
    const requestUrl = new URL(options.url);
    requestUrl.searchParams.append('f', 'json');
    return this.http.get<FeatureLayerConfig>(requestUrl.toString(), this.getHttpOptions(options.requestWithCredentials));
  }

  getFeatures(options: FeatureLayerOptions): Observable<GeoJSON.Feature<GeoJSON.Geometry>[]> {
    let resultOffset = 0;
    return this.loadFeatures(options, 0).pipe(
      expand((response: any) => {
        if (response.exceededTransferLimit) {
          resultOffset = resultOffset + options.featuresPerRequestLimit;
          return this.loadFeatures(options, resultOffset);
        } else {
          return EMPTY;
        }
      }),
      map((collection: any) => {
        return collection.features ?? [];
      }),
      reduce((all, latest) => {
        return all.concat(latest);
      }, []));
  }

  private getHttpOptions(secure: boolean): { [header: string]: string } | undefined {
    return secure ? {withCredentials: 'true'} : undefined;
  }

  private loadFeatures(options: FeatureLayerOptions, resultOffset: number): Observable<any> {
    const requestUrl = new URL(`${options.url}/query`);
    const searchParams = requestUrl.searchParams;
    searchParams.append('where', options.filter ?? '1=1');
    searchParams.append('resultOffset', String(resultOffset));
    searchParams.append('resultRecordCount', String(options.featuresPerRequestLimit));
    searchParams.append('token', '');
    searchParams.append('f', 'geojson');
    searchParams.append('returnExceededLimitFeatures', 'true');
    searchParams.append('outSR', this.wgs84wkid);
    searchParams.append('returnGeometry', 'true');
    searchParams.append('outFields', options.outFields ? options.outFields.join() : '*');
    return this.http.get(requestUrl.toString(), this.getHttpOptions(options.requestWithCredentials));
  }
}
