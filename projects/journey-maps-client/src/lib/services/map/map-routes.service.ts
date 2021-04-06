import {Injectable} from '@angular/core';
import {MapService} from './map.service';
import {MapRouteService} from './map-route.service';

@Injectable({providedIn: 'root'})
export class MapRoutesService {

  constructor(
    private mapService: MapService,
    private mapRouteService: MapRouteService,
  ) {}

  updateRoutesRaw(map: mapboxgl.Map, routesGeoJSONs: GeoJSON.FeatureCollection[]): void {
    if (!routesGeoJSONs?.length) {
      return;
    }

    this.mapRouteService.updateRoute(map, {
      type: 'FeatureCollection',
      // With ES2019 we can replace this with routesGeoJSONs.flatMap(({features}) => features)
      features: routesGeoJSONs.reduce((accumulatedFeatures, next) => accumulatedFeatures.concat(next.features), []),
    });
  }
}
