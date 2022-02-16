import {Map as MaplibreMap} from 'maplibre-gl';
import {FeatureDataType, FeaturesClickEventData} from '../../../journey-maps-client.interfaces';
import {RouteUtils} from './route-utils';
import {MapEventUtils} from './map-event-utils';

export class FeatureSelectionHandler {

  constructor(private mapInstance: MaplibreMap, private layerIds: string[]) {
    if (!this.layerIds.length) {
      return;
    }
  }

  toggleSelection(eventData: FeaturesClickEventData): void {
    for (let data of eventData.features) {
      const selected = !data.state.selected;
      MapEventUtils.setFeatureState(data, this.mapInstance, {selected});

      if (data.featureDataType !== FeatureDataType.ROUTE) {
        continue;
      }
      const relatedRouteFeatures = RouteUtils.findRelatedRoutes(data, this.mapInstance);
      if (!relatedRouteFeatures.length) {
        continue;
      }
      for (let routeMapFeature of relatedRouteFeatures) {
        MapEventUtils.setFeatureState(routeMapFeature, this.mapInstance, {selected});
      }
    }
  }
}
