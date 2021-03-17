import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource} from 'mapbox-gl';
import {MapService} from './map.service';

@Injectable({providedIn: 'root'})
export class MapRouteService {

  constructor(private mapService: MapService) {
  }

  updateRoute(map: mapboxgl.Map, routeFeatureCollection: GeoJSON.FeatureCollection = this.mapService.emptyFeatureCollection): void {
    const source = map.getSource(Constants.ROUTE_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
  }
}