import {FeatureData, FeatureDataType} from '../../../journey-maps-client.interfaces';
import {MapEventUtils} from './map-event-utils';
import {Map as MaplibreMap} from 'maplibre-gl';
import {MapRoutesService} from '../map-routes.service';

export const ROUTE_ID_PROPERTY_NAME = 'routeId';
export const SELECTED_PROPERTY_NAME = 'isSelected';

export class RouteUtils {

  static filterRouteFeatures(currentFeatures: FeatureData[]): FeatureData[] {
    return currentFeatures.filter(hovered => !!hovered.properties[ROUTE_ID_PROPERTY_NAME]);
  }

  static getRouteId(routeFeature: FeatureData): string | undefined {
    return routeFeature.properties[ROUTE_ID_PROPERTY_NAME];
  }

  /**
   * 'all' => find all routes in source |
   * 'visibleOnly' => find all routes in visible layer, means only current visible generalization
   * */
  static findRelatedRoutes(routeFeature: FeatureData, mapInstance: MaplibreMap, find: 'all' | 'visibleOnly'): FeatureData[] {
    const routeId = RouteUtils.getRouteId(routeFeature);
    const filter = [
      'all',
      ['==', ROUTE_ID_PROPERTY_NAME, routeId],
      ['!=', '$id', routeFeature.id]
    ];
    if (find === 'visibleOnly') {
      const layers = MapRoutesService.allRouteLayers;
      return MapEventUtils.queryVisibleFeaturesByFilter(mapInstance, routeFeature, layers, filter);
    } else {
      return MapEventUtils.queryFeatureSourceByFilter(mapInstance, FeatureDataType.ROUTE, filter);
    }
  }

  static initSelectedState(mapInstance: MaplibreMap): void {
    const getMapFeatures = MapEventUtils.queryFeatureSourceByFilter(mapInstance, FeatureDataType.ROUTE,
      ['==', ['boolean', ['get', SELECTED_PROPERTY_NAME], false], true]
    );
    getMapFeatures.forEach(mapFeature => MapEventUtils.setFeatureState(mapFeature, mapInstance, {selected: true}));
  }
}