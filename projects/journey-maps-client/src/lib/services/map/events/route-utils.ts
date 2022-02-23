import {FeatureData, FeatureDataType} from '../../../journey-maps-client.interfaces';
import {MapEventUtils} from './map-event-utils';
import {Map as MaplibreMap} from 'maplibre-gl';
import {MapRoutesService} from '../map-routes.service';
import {Feature} from 'geojson';
import {FeatureSelectionHandler} from './feature-selection-handler';

export const ROUTE_ID_PROPERTY_NAME = 'routeId';
export const SELECTED_PROPERTY_NAME = 'isSelected';

export class RouteUtils {

  static filterRouteFeatures(currentFeatures: FeatureData[]): FeatureData[] {
    return currentFeatures.filter(hovered => !!hovered.properties[ROUTE_ID_PROPERTY_NAME]);
  }

  static getRouteFilter(routeFeature: Feature): any[] {
    const routeId = routeFeature.properties[ROUTE_ID_PROPERTY_NAME];
    return [
      'all',
      ['==', ROUTE_ID_PROPERTY_NAME, routeId],
      ['!=', '$id', routeFeature.id ?? -1]
    ];
  }

  /**
   * 'all' => find all routes in source |
   * 'visibleOnly' => find all routes in visible layer, means only current visible generalization
   * */
  static findRelatedRoutes(routeFeature: Feature, mapInstance: MaplibreMap, find: 'all' | 'visibleOnly'): FeatureData[] {
    const filter = RouteUtils.getRouteFilter(routeFeature);
    if (find === 'visibleOnly') {
      const layers = MapRoutesService.allRouteLayers;
      return MapEventUtils.queryVisibleFeaturesByFilter(mapInstance, FeatureDataType.ROUTE, layers, filter);
    } else {
      return MapEventUtils.queryFeatureSourceByFilter(mapInstance, FeatureDataType.ROUTE, filter);
    }
  }

  static initSelectedState(mapInstance: MaplibreMap, features: Feature[]): void {
    const selectedFeatures = features.filter(f => f.properties[SELECTED_PROPERTY_NAME]);
    selectedFeatures.forEach(data => {
      FeatureSelectionHandler.setRelatedRouteFeaturesSelection(mapInstance, data, true);
    });
    FeatureSelectionHandler.lastEventData = new Map(selectedFeatures.map(f => [f, true]));
  }
}
