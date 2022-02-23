import {
  FeatureDataType,
  FeaturesClickEventData,
  SelectionMode,
  FeaturesSelectEventData,
  FeatureData
} from '../../../journey-maps-client.interfaces';
import {ROUTE_ID_PROPERTY_NAME, RouteUtils} from './route-utils';
import {MapEventUtils} from './map-event-utils';
import {Subject, Subscription} from 'rxjs';
import {sampleTime} from 'rxjs/operators';
import {Map as MaplibreMap} from 'maplibre-gl';
import {Feature} from 'geojson';

const MAP_MOVE_SAMPLE_TIME_MS = 100;

export class FeatureSelectionHandler {

  static lastEventData: Map<Feature, boolean>;

  private subscription: Subscription;

  constructor(
    private mapInstance: MaplibreMap,
    private layersTypes: Map<string, FeatureDataType>,
    private selectionModes: Map<FeatureDataType, SelectionMode>) {

    this.attachMapMoveEvent();
  }

  complete() {
    this.subscription?.unsubscribe();
  }

  toggleSelection(eventData: FeaturesClickEventData): void {
    for (let data of eventData.features) {
      const selected = !data.state.selected;
      this.setFeatureSelection(data, selected);
    }

    FeatureSelectionHandler.lastEventData = new Map(eventData.features.map(f => [f, f.state.selected]));
  }

  findSelectedFeatures(): FeaturesSelectEventData {
    return {features: MapEventUtils.queryFeaturesByProperty(this.mapInstance, this.layersTypes, feature => feature.state.selected)};
  }

  private setFeatureSelection(data: FeatureData, selected: boolean) {
    if (this.selectionModes.get(data.featureDataType) === SelectionMode.single) {
      // if multiple features of same type, only the last in the list will be selected:
      this.findSelectedFeatures()
        .features.filter(data => data.featureDataType === data.featureDataType)
        .forEach(data => MapEventUtils.setFeatureState(data, this.mapInstance, {selected: false}));
    }

    MapEventUtils.setFeatureState(data, this.mapInstance, {selected});

    FeatureSelectionHandler.setRelatedRouteFeaturesSelection(this.mapInstance, data, selected);
  }

  static setRelatedRouteFeaturesSelection(mapInstance: MaplibreMap, feature: Feature, selected: boolean) {
    if (!feature.properties[ROUTE_ID_PROPERTY_NAME]) {
      return;
    }
    const relatedRouteFeatures = RouteUtils.findRelatedRoutes(feature, mapInstance, 'all');
    if (!relatedRouteFeatures.length) {
      return;
    }
    for (let routeMapFeature of relatedRouteFeatures) {
      MapEventUtils.setFeatureState(routeMapFeature, mapInstance, {selected});
    }
  }

  private attachMapMoveEvent() {
    const mapMove = new Subject();
    this.subscription = mapMove.pipe(sampleTime(MAP_MOVE_SAMPLE_TIME_MS))
      .subscribe(() => {
        FeatureSelectionHandler.lastEventData?.forEach((isSelected, feature) => {
          FeatureSelectionHandler.setRelatedRouteFeaturesSelection(this.mapInstance, feature, isSelected);
        });
      });

    this.mapInstance.on('move', () => mapMove.next());
  }
}
