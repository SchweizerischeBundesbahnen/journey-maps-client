import {FeatureData} from '../../../journey-maps-client.interfaces';
import {MapEventUtils} from './map-event-utils';
import {Map as MaplibreMap} from 'maplibre-gl';

export const ROUTE_ID_PROPERTY_NAME = 'routeId';

export class RouteUtils {

  static filterRouteFeatures(currentFeatures: FeatureData[]): FeatureData[] {
    return currentFeatures.filter(hovered => !!hovered.properties[ROUTE_ID_PROPERTY_NAME]);
  }

  static getRouteId(routeFeature: FeatureData): string | undefined {
    return routeFeature.properties[ROUTE_ID_PROPERTY_NAME];
  }

  static findRelatedRoutes(routeFeature: FeatureData, mapInstance: MaplibreMap): FeatureData[] {
    const routeId = RouteUtils.getRouteId(routeFeature);
    const filter = [
      'all',
      ['==', ROUTE_ID_PROPERTY_NAME, routeId],
      ['!=', '$id', routeFeature.id]
    ];
    return MapEventUtils.queryFeaturesByFilter(mapInstance, routeFeature, filter);
  }
}
