import {FeatureData, FeatureDataType} from '../../../journey-maps-client.interfaces';
import {MapEventUtils} from './map-event-utils';
import {Map as MaplibreMap} from 'maplibre-gl';

export const ROUTE_ID_PROPERTY_NAME = 'routeId';
export const SELECTED_PROPERTY_NAME = 'isSelected';

export class RouteUtils {

  static filterRouteFeatures(currentFeatures: FeatureData[]): FeatureData[] {
    return currentFeatures.filter(hovered => !!hovered.properties[ROUTE_ID_PROPERTY_NAME]);
  }

  static getRouteId(routeFeature: FeatureData): string | undefined {
    return routeFeature.properties[ROUTE_ID_PROPERTY_NAME];
  }

  static findRelatedRoutes(routeFeature: FeatureData, mapInstance: MaplibreMap, find: 'all' | 'visibleOnly'): FeatureData[] {
    const routeId = RouteUtils.getRouteId(routeFeature);
    const filter = [
      'all',
      ['==', ROUTE_ID_PROPERTY_NAME, routeId],
      ['!=', '$id', routeFeature.id]
    ];
    if (find === 'visibleOnly') {
      return MapEventUtils.queryVisibleFeaturesByFilter(mapInstance, routeFeature, filter);
    } else {
      return MapEventUtils.querySourceFeaturesByFilter(mapInstance, FeatureDataType.ROUTE, filter);
    }
  }

  static initSelectedState(mapInstance: MaplibreMap): void {
    const getMapFeatures = MapEventUtils.querySourceFeaturesByFilter(mapInstance, FeatureDataType.ROUTE,
      ['==', ['boolean', ['get', SELECTED_PROPERTY_NAME], false], true]
    );
    getMapFeatures.forEach(mapFeature => MapEventUtils.setFeatureState(mapFeature, mapInstance, {selected: true}));
  }
}
