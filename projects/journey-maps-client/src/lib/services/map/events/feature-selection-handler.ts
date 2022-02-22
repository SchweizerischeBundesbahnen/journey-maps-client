import {
  FeatureDataType,
  FeaturesClickEventData,
  SelectionMode,
  FeaturesSelectEventData,
  FeatureData
} from '../../../journey-maps-client.interfaces';
import {RouteUtils} from './route-utils';
import {MapEventUtils} from './map-event-utils';
import {Subject, Subscription} from 'rxjs';
import {sampleTime} from 'rxjs/operators';

const MAP_MOVE_SAMPLE_TIME_MS = 50;

export class FeatureSelectionHandler {

  private subscription: Subscription;
  private lastFeaturesClickEventData: FeaturesClickEventData;

  constructor(
    private mapInstance: maplibregl.Map,
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

    this.lastFeaturesClickEventData = eventData;
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

    if (data.featureDataType !== FeatureDataType.ROUTE) {
      return;
    }

    this.setRelatedRouteFeaturesSelection(data, selected);
  }

  private setRelatedRouteFeaturesSelection(data: FeatureData, selected: boolean) {
    const relatedRouteFeatures = RouteUtils.findRelatedRoutes(data, this.mapInstance, 'all');
    if (!relatedRouteFeatures.length) {
      return;
    }
    for (let routeMapFeature of relatedRouteFeatures) {
      MapEventUtils.setFeatureState(routeMapFeature, this.mapInstance, {selected});
    }
  }

  private attachMapMoveEvent() {
    const mapMove = new Subject();
    this.subscription = mapMove.pipe(sampleTime(MAP_MOVE_SAMPLE_TIME_MS))
      .subscribe(() => {
        this.lastFeaturesClickEventData?.features.forEach(data => {
          this.setRelatedRouteFeaturesSelection(data, data.state?.selected);
        });
      });

    this.mapInstance.on('move', () => mapMove.next());
  }
}
