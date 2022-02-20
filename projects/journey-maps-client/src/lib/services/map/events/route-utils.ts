import {FeatureData} from '../../../journey-maps-client.interfaces';
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

  static findRelatedRoutes(routeFeature: FeatureData, mapInstance: MaplibreMap): FeatureData[] {
    const routeId = RouteUtils.getRouteId(routeFeature);
    const filter = [
      'all',
      ['==', ROUTE_ID_PROPERTY_NAME, routeId],
      ['!=', '$id', routeFeature.id]
    ];
    return MapEventUtils.queryFeaturesByFilter(mapInstance, routeFeature, filter);
  }

  // CHECKME ses:
  //  - Funktioniert nicht mit generalisierten Routen
  static initSelectedState(mapInstance: MaplibreMap): void {
    const getMapFeatures = mapInstance.queryRenderedFeatures(null, {
      layers: MapRoutesService.allRouteLayers,
      filter: ['==', ['boolean', ['get', SELECTED_PROPERTY_NAME], false], true],
    });
    getMapFeatures.forEach(mapFeature => MapEventUtils.setFeatureState(mapFeature, mapInstance, {selected: true}));
  }
}
