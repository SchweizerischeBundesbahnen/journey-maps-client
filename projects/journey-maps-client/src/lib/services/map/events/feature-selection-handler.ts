import {Map as MaplibreMap, MapboxGeoJSONFeature} from 'maplibre-gl';
import {FeatureDataType, FeaturesClickEventData, FeatureSelection} from '../../../journey-maps-client.interfaces';
import {RouteUtils} from './route-utils';
import {MapEventUtils} from './map-event-utils';

export class FeatureSelectionHandler {

  constructor(private mapInstance: MaplibreMap, private layers: Map<string, FeatureDataType>) {
    if (!this.layers.size) {
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

  selectFeatures(featureSelections: FeatureSelection[]): void {
    // unselect all
    const selectedFeatures = this.findSelected();
    selectedFeatures.forEach(feature => MapEventUtils.setFeatureState(feature, this.mapInstance, {selected: false}));

    // get features by featureSelections
    const getMapFeatures = this.mapInstance.queryRenderedFeatures(null, {
      layers: [...this.layers.keys()],
      filter: ['in', '$id', ...featureSelections.map(f => f.featureId)]
    });
    // select features
    getMapFeatures.forEach(mapFeature => MapEventUtils.setFeatureState(mapFeature, this.mapInstance, {selected: true}));
  }

  findSelectedFeatures(): FeatureSelection[] {
    return this.findSelected().map(mapFeature => {
      return {
        featureId: Number(mapFeature.id),
        featureDataType: this.layers.get(mapFeature.layer.id)
      };
    });
  }

  private findSelected(): MapboxGeoJSONFeature[] {
    return this.mapInstance.queryRenderedFeatures(null, {
      layers: [...this.layers.keys()]
    }).filter(feature => feature.state.selected);
  }
}
