import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource, Map as MaplibreMap} from 'maplibre-gl';
import {EMPTY_FEATURE_COLLECTION} from './map.service';
import {
  MapSelectionEventService
} from './events/map-selection-event.service';

@Injectable({providedIn: 'root'})
export class MapRouteService {

  updateRoute(
    map: MaplibreMap,
    featureSelectionHandlerService: MapSelectionEventService,
    routeFeatureCollection: GeoJSON.FeatureCollection = EMPTY_FEATURE_COLLECTION
  ): void {
    const source = map.getSource(Constants.ROUTE_SOURCE) as GeoJSONSource;
    source.setData(routeFeatureCollection);
    if (routeFeatureCollection.features?.length) {
      map.once('idle', () => featureSelectionHandlerService.initSelectedState(map, routeFeatureCollection.features));
    }
  }
}
