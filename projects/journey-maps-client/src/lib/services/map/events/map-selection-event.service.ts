import {
  FeatureDataType,
  FeaturesClickEventData,
  SelectionMode,
  FeaturesSelectEventData,
  FeatureData
} from '../../../journey-maps-client.interfaces';
import {RouteUtilsService, SELECTED_PROPERTY_NAME} from './route-utils.service';
import {MapEventUtilsService} from './map-event-utils.service';
import {Subject, Subscription} from 'rxjs';
import {sampleTime} from 'rxjs/operators';
import {Map as MaplibreMap} from 'maplibre-gl';
import {Feature} from 'geojson';
import {Injectable} from '@angular/core';

const MAP_MOVE_SAMPLE_TIME_MS = 100;

/**
 journey-maps-client component scope service.
 Use one service instance per map instance.
 */
@Injectable()
export class MapSelectionEventService {
  private lastEventData: Map<Feature, boolean>;
  private subscription: Subscription;

  private mapInstance: MaplibreMap;
  private layersTypes: Map<string, FeatureDataType>;
  private selectionModes: Map<FeatureDataType, SelectionMode>;

  constructor(
    private routeUtilsService: RouteUtilsService,
    private mapEventUtils: MapEventUtilsService) {
  }

  initialize(
    mapInstance: MaplibreMap,
    layersTypes: Map<string, FeatureDataType>,
    selectionModes: Map<FeatureDataType, SelectionMode>) {
    this.mapInstance = mapInstance;
    this.layersTypes = layersTypes;
    this.selectionModes = selectionModes;
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

    this.lastEventData = new Map(eventData.features.map(f => [f, f.state.selected]));
  }

  initSelectedState(mapInstance: MaplibreMap, features: Feature[]): void {
    const selectedFeatures = features.filter(f => f.properties[SELECTED_PROPERTY_NAME]);
    selectedFeatures.forEach(data => {
      this.routeUtilsService.setRelatedRouteFeaturesSelection(mapInstance, data, true);
    });
    this.lastEventData = new Map(selectedFeatures.map(f => [f, true]));
  }

  findSelectedFeatures(): FeaturesSelectEventData {
    return {features: this.mapEventUtils.queryFeaturesByProperty(this.mapInstance, this.layersTypes, feature => feature.state.selected)};
  }

  private setFeatureSelection(data: FeatureData, selected: boolean) {
    if (this.selectionModes.get(data.featureDataType) === SelectionMode.single) {
      // if multiple features of same type, only the last in the list will be selected:
      this.findSelectedFeatures()
        .features.filter(data => data.featureDataType === data.featureDataType)
        .forEach(data => this.mapEventUtils.setFeatureState(data, this.mapInstance, {selected: false}));
    }

    this.mapEventUtils.setFeatureState(data, this.mapInstance, {selected});

    this.routeUtilsService.setRelatedRouteFeaturesSelection(this.mapInstance, data, selected);
  }

  private attachMapMoveEvent() {
    this.complete();
    const mapMove = new Subject();
    this.subscription = mapMove.pipe(sampleTime(MAP_MOVE_SAMPLE_TIME_MS))
      .subscribe(() => {
        this.lastEventData?.forEach((isSelected, feature) => {
          this.routeUtilsService.setRelatedRouteFeaturesSelection(this.mapInstance, feature, isSelected);
        });
      });

    this.mapInstance.on('move', () => mapMove.next());
  }
}
