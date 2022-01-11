import {Injectable} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {expand, map, reduce} from 'rxjs/operators';
import {FeatureLayerOptions} from '../models/feature-layer-options';
import {FeatureLayerInfoResponse} from '../models/feature-layer-info-response';

@Injectable({
  providedIn: 'root'
})

export class FeatureLayerService {

  private readonly wgs84wkid = '4326';

  constructor(private http: HttpClient) {
  }

  getFeatureLayerConfig(options: FeatureLayerOptions): Observable<FeatureLayerInfoResponse> {
    const requestUrl = new URL(options.url);
    requestUrl.searchParams.append('f', 'json');
    return this.http.get<FeatureLayerInfoResponse>(requestUrl.toString(), this.getHttpOptions(options.requestWithCredentials, options.accessToken));
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

  private getHttpOptions(secure: boolean, accessToken?: { [name: string]: string }):
    { params?: { [header: string]: string }, withCredentials?: boolean } {
    // see: https://enterprise.arcgis.com/de/server/latest/administer/windows/accessing-arcgis-token-secured-web-services.htm
    // accessToken must be a request query instead a header parameter,
    // because of preflight-request limitation: https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request
    const options = {
      params: accessToken ?? {}
    };

    if (secure) {
      options['withCredentials'] = true;
    }
    return options;
  }

  private loadFeatures(options: FeatureLayerOptions, resultOffset: number): Observable<any> {
    const requestUrl = new URL(`${options.url}/query`);
    const searchParams = requestUrl.searchParams;
    searchParams.append('where', options.filter ?? '1=1');
    searchParams.append('resultOffset', String(resultOffset));
    searchParams.append('resultRecordCount', String(options.featuresPerRequestLimit));
    searchParams.append('f', 'geojson');
    searchParams.append('returnExceededLimitFeatures', 'true');
    searchParams.append('outSR', this.wgs84wkid);
    searchParams.append('returnGeometry', 'true');
    searchParams.append('outFields', options.outFields ? options.outFields.join() : '');
    return this.http.get(requestUrl.toString(), this.getHttpOptions(options.requestWithCredentials, options.accessToken));
  }
}
