import {FeatureDataType, FeaturesClickEventData, FeatureData, SelectionMode} from '../../../journey-maps-client.interfaces';
import {RouteUtils} from './route-utils';
import {MapEventUtils} from './map-event-utils';

export class FeatureSelectionHandler {

  constructor(
    private mapInstance: maplibregl.Map,
    private layersTypes: Map<string, FeatureDataType>,
    private selectionModes: Map<FeatureDataType, SelectionMode>) {
  }

  toggleSelection(eventData: FeaturesClickEventData): void {
    for (let data of eventData.features) {
      const selected = !data.state.selected;

      if (this.selectionModes[data.featureDataType] === SelectionMode.single) {
        // TODO
      }

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

  findSelectedFeatures(): FeatureData[] {
    return MapEventUtils.queryFeaturesByProperty(this.mapInstance, this.layersTypes, feature => feature.state.selected);
  }
}
