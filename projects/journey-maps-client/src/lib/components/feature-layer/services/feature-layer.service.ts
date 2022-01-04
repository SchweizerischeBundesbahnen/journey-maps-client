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
      map((obj: any) => {
        return obj.features ?? [];
      }),
      reduce((acc, x) => {
        return acc.concat(x);
      }, []));
  }

  convertScaleToLevel(scale: number): number {
    if (scale === 0) {
      return 0;
    }

    const lower = this.arcgisLODs.find(lod => lod.scale < scale);
    return (lower.level - 1) + (scale / (lower.scale * 2));
  }

  private getHttpOptions(secure: boolean): { [header: string]: string } | undefined {
    return secure ? {withCredentials: 'true'} : undefined;
  }

  private loadFeatures(options: FeatureLayerOptions, resultOffset: number): Observable<any> {
    const requestUrl = new URL(`${options.url}/query`);
    requestUrl.searchParams.append('where', options.filter ?? '1=1');
    requestUrl.searchParams.append('resultOffset', String(resultOffset));
    requestUrl.searchParams.append('resultRecordCount', String(options.featuresPerRequestLimit));
    requestUrl.searchParams.append('token', '');
    requestUrl.searchParams.append('f', 'geojson');
    requestUrl.searchParams.append('returnExceededLimitFeatures', 'true');
    requestUrl.searchParams.append('outSR', this.wgs84wkid);
    requestUrl.searchParams.append('returnGeometry', 'true');
    requestUrl.searchParams.append('outFields', options.outFields ? options.outFields.join() : '');
    return this.http.get(requestUrl.toString(), this.getHttpOptions(options.requestWithCredentials));
  }

  private readonly arcgisLODs = [
    {'level': 0, 'scale': 5.91657527591555E8}, {
      'level': 1, 'scale': 2.95828763795777E8
    }, {'level': 2, 'scale': 1.47914381897889E8}, {
      'level': 3, 'scale': 7.3957190948944E7
    }, {'level': 4, 'scale': 3.6978595474472E7}, {
      'level': 5, 'scale': 1.8489297737236E7
    }, {'level': 6, 'scale': 9244648.868618}, {
      'level': 7, 'scale': 4622324.434309
    }, {'level': 8, 'scale': 2311162.217155}, {
      'level': 9, 'scale': 1155581.108577
    }, {'level': 10, 'scale': 577790.554289}, {
      'level': 11, 'scale': 288895.277144
    }, {'level': 12, 'scale': 144447.638572}, {
      'level': 13, 'scale': 72223.819286
    }, {'level': 14, 'scale': 36111.909643}, {
      'level': 15, 'scale': 18055.954822
    }, {'level': 16, 'scale': 9027.977411}, {
      'level': 17, 'scale': 4513.988705
    }, {'level': 18, 'scale': 2256.994353}, {
      'level': 19, 'scale': 1128.497176
    }, {'level': 20, 'scale': 564.248588}, {
      'level': 21, 'scale': 282.124294
    }, {'level': 22, 'scale': 141.062147}, {
      'level': 23, 'scale': 70.5310735
    }, {'level': 24, 'scale': 0}
  ];
}
