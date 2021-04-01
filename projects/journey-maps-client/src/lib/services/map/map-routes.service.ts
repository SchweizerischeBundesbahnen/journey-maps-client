import {Injectable} from '@angular/core';
import {MapService} from './map.service';
import {MapRouteService} from './map-route.service';

@Injectable({providedIn: 'root'})
export class MapRoutesService {

  constructor(
    private mapService: MapService,
    private mapRouteService: MapRouteService,
  ) {}

  updateRoutesRaw(map: mapboxgl.Map, routesGeoJSONs: string): void {
    const featureCollections: GeoJSON.FeatureCollection[] = routesGeoJSONs?.length ? JSON.parse(routesGeoJSONs) : [];
    this.mapRouteService.updateRoute(map, {
      type: 'FeatureCollection',
      features: featureCollections.reduce((accumulatedFeatures, next) => [...accumulatedFeatures, ...next.features], []),
    });
  }
}
