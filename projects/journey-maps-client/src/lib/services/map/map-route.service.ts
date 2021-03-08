import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource} from 'mapbox-gl';

@Injectable({providedIn: 'root'})
export class MapRouteService {

  constructor() {
  }

  updateRoute(map: mapboxgl.Map, routeFeatureCollection: GeoJSON.FeatureCollection): void {
    const source = map.getSource(Constants.ROUTE_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
  }
}
