import {Injectable} from '@angular/core';
import {MapService} from './map.service';
import {MapRouteService} from './map-route.service';
import {Map as MaplibreMap} from 'maplibre-gl';

@Injectable({providedIn: 'root'})
export class MapRoutesService {

  allRouteLayers: string[] = [
    'rokas-route',
    'rokas-route-gen0',
    'rokas-route-gen1',
    'rokas-route-gen2',
    'rokas-route-gen3',
    'rokas-route-gen4'
  ];

  constructor(
    private mapService: MapService,
    private mapRouteService: MapRouteService,
  ) {
  }

  updateRoutes(map: MaplibreMap, routes: GeoJSON.FeatureCollection[] = [this.mapService.emptyFeatureCollection]): void {
    this.mapRouteService.updateRoute(map, {
      type: 'FeatureCollection',
      // With ES2019 we can replace this with routes.flatMap(({features}) => features)
      features: routes.reduce((accumulatedFeatures, next) => accumulatedFeatures.concat(next.features), []),
    });
  }
}
