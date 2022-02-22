import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource, Map as MaplibreMap} from 'maplibre-gl';
import {MapService} from './map.service';
import {RouteUtils} from './events/route-utils';

@Injectable({providedIn: 'root'})
export class MapRouteService {

  constructor(private mapService: MapService) {
  }

  updateRoute(map: MaplibreMap, routeFeatureCollection: GeoJSON.FeatureCollection = this.mapService.emptyFeatureCollection): void {
    const source = map.getSource(Constants.ROUTE_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
    if (routeFeatureCollection.features?.length) {
      map.once('idle', () => RouteUtils.initSelectedState(map));
    }
  }
}
