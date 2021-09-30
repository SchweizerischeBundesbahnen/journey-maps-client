import {Injectable} from '@angular/core';
import {MapService} from './map.service';
import {MapRouteService} from './map-route.service';

@Injectable({providedIn: 'root'})
export class MapRoutesService {

  constructor(
    private mapService: MapService,
    private mapRouteService: MapRouteService,
  ) {}

  updateRoutes(map: maplibregl.Map, routes: GeoJSON.FeatureCollection[] = [this.mapService.emptyFeatureCollection]): void {
    this.mapRouteService.updateRoute(map, {
      type: 'FeatureCollection',
      // With ES2019 we can replace this with routes.flatMap(({features}) => features)
      features: routes.reduce((accumulatedFeatures, next) => accumulatedFeatures.concat(next.features), []),
    });
  }
}
