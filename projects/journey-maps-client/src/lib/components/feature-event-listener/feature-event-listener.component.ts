import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {
  FeatureData,
  FeatureDataType,
  FeaturesClickEventData,
  FeaturesHoverChangeEventData,
  FeaturesSelectEventData,
  ListenerOptions,
  SelectionMode,
} from '../../journey-maps-client.interfaces';
import {MapCursorStyleEvent} from '../../services/map/events/map-cursor-style-event';
import {MapStationService} from '../../services/map/map-station.service';
import {FeaturesClickEvent} from '../../services/map/events/features-click-event';
import {takeUntil} from 'rxjs/operators';
import {LngLatLike, Map as MapLibreMap} from 'maplibre-gl';
import {Subject} from 'rxjs';
import {MapRoutesService} from '../../services/map/map-routes.service';
import {MapMarkerService} from '../../services/map/map-marker.service';
import {FeaturesHoverEvent} from '../../services/map/events/features-hover-event';
import {MapSelectionEventService} from '../../services/map/events/map-selection-event.service';
import {MapZoneService} from '../../services/map/map-zone.service';
import {ROUTE_ID_PROPERTY_NAME, RouteUtilsService} from '../../services/map/events/route-utils.service';
import {MapEventUtilsService} from '../../services/map/events/map-event-utils.service';

@Component({
  selector: 'rokas-feature-event-listener',
  templateUrl: './feature-event-listener.component.html',
  providers: [MapSelectionEventService]
})
export class FeatureEventListenerComponent implements OnChanges, OnDestroy {

  @Input() listenerOptions: ListenerOptions;
  @Input() map: MapLibreMap;

  @Output() featureSelectionsChange = new EventEmitter<FeaturesSelectEventData>();

  @Output() featuresClick = new EventEmitter<FeaturesClickEventData>();
  @Output() featuresHoverChange = new EventEmitter<FeaturesHoverChangeEventData>();

  // CONTINUE ROKAS-502: Add overlay on hover
  overlayVisible = false;
  overlayFeatures: FeatureData[];
  overlayPosition: LngLatLike;

  private destroyed = new Subject<void>();
  private watchOnLayers = new Map<string, FeatureDataType>();
  private mapCursorStyleEvent: MapCursorStyleEvent;
  private featuresHoverEvent: FeaturesHoverEvent;
  private featuresClickEvent: FeaturesClickEvent;

  constructor(
    private mapStationService: MapStationService,
    private mapRoutesService: MapRoutesService,
    private mapMarkerService: MapMarkerService,
    private routeUtilsService: RouteUtilsService,
    private mapEventUtils: MapEventUtilsService,
    public readonly mapSelectionEventService: MapSelectionEventService,
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    this.mapCursorStyleEvent?.complete();
    this.featuresHoverEvent?.complete();
    this.featuresClickEvent?.complete();
    this.mapSelectionEventService?.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.listenerOptions && this.map) {
      this.watchOnLayers.clear();

      if (this.listenerOptions.MARKER?.watch) {
        this.updateWatchOnLayers(this.mapMarkerService.allMarkerAndClusterLayers, FeatureDataType.MARKER);
      }
      if (this.listenerOptions.ROUTE?.watch) {
        this.updateWatchOnLayers(MapRoutesService.allRouteLayers, FeatureDataType.ROUTE);
      }
      if (this.listenerOptions.STATION?.watch) {
        this.updateWatchOnLayers([MapStationService.STATION_LAYER], FeatureDataType.STATION);
        this.mapStationService.registerStationUpdater(this.map);
      } else {
        this.mapStationService.deregisterStationUpdater(this.map);
      }
      if (this.listenerOptions.ZONE?.watch) {
        this.updateWatchOnLayers(MapZoneService.allZoneLayers, FeatureDataType.ZONE);
      }

      this.mapCursorStyleEvent?.complete();
      this.mapCursorStyleEvent = new MapCursorStyleEvent(this.map, [...this.watchOnLayers.keys()]);

      const selectionModes = this.listenerOptionsToSelectionModes();
      this.mapSelectionEventService?.complete();
      this.mapSelectionEventService.initialize(this.map, this.watchOnLayers, selectionModes);

      if (!this.featuresClickEvent) {
        this.featuresClickEvent = new FeaturesClickEvent(this.map, this.mapEventUtils, this.watchOnLayers);
        this.featuresClickEvent
          .pipe(takeUntil(this.destroyed))
          .subscribe(data => this.featureClicked(data));
      }

      if (!this.featuresHoverEvent) {
        this.featuresHoverEvent = new FeaturesHoverEvent(this.map, this.mapEventUtils, this.watchOnLayers, this.routeUtilsService);
        this.featuresHoverEvent
          .pipe(takeUntil(this.destroyed))
          .subscribe(data => this.featureHovered(data));
      }
    }
  }

  private updateWatchOnLayers(layers: string[], featureDataType: FeatureDataType): void {
    layers.forEach(id => this.watchOnLayers.set(id, featureDataType));
  }

  private listenerOptionsToSelectionModes() {
    const selectionModes = new Map<FeatureDataType, SelectionMode>();
    selectionModes.set(FeatureDataType.ROUTE, this.listenerOptions.ROUTE?.selectionMode ?? SelectionMode.single);
    selectionModes.set(FeatureDataType.MARKER, this.listenerOptions.MARKER?.selectionMode ?? SelectionMode.single);
    selectionModes.set(FeatureDataType.STATION, this.listenerOptions.STATION?.selectionMode ?? SelectionMode.single);
    selectionModes.set(FeatureDataType.ZONE, this.listenerOptions.ZONE?.selectionMode ?? SelectionMode.multi);
    return selectionModes;
  }

  overlayOptions(): any {
    if (this.listenerOptions && this.overlayFeatures?.length) {
      return this.listenerOptions[this.overlayFeatures[0].featureDataType] ?? {};
    }

    return {};
  }

  private featureClicked(data: FeaturesClickEventData) {
    this.mapSelectionEventService.toggleSelection(data);
    this.featureSelectionsChange.next(this.mapSelectionEventService.findSelectedFeatures());
    this.featuresClick.next(data);

    const topMostFeature = data.features[0];
    const template = this.listenerOptions[topMostFeature.featureDataType]?.clickTemplate;
    if (template) {
      this.overlayVisible = true;
      this.overlayFeatures = this.filterOverlayFeatures(data.features, topMostFeature.featureDataType);
      if (topMostFeature.geometry.type === 'Point') {
        this.overlayPosition = topMostFeature.geometry.coordinates as LngLatLike;
      } else {
        this.overlayPosition = data.clickLngLat;
      }
    } else {
      this.overlayVisible = false;
    }
  }

  private filterOverlayFeatures(features: FeatureData[], type: FeatureDataType): FeatureData[] {
    const filteredByType = features.filter(f => f.featureDataType === type);
    if (type !== FeatureDataType.ROUTE) {
      return filteredByType;
    }

    // Only one feature per route id
    return [...new Map(filteredByType.map(route => [route.properties[ROUTE_ID_PROPERTY_NAME], route])).values()];
  }

  private featureHovered(data: FeaturesHoverChangeEventData) {
    this.featuresHoverChange.next(data);
  }
}
