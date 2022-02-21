import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {
  FeatureData,
  FeatureDataType,
  FeaturesClickEventData,
  FeaturesHoverChangeEventData,
  ListenerOptions, SelectionMode
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
import {FeatureSelectionHandler} from '../../services/map/events/feature-selection-handler';

@Component({
  selector: 'rokas-feature-event-listener',
  templateUrl: './feature-event-listener.component.html'
})
export class FeatureEventListenerComponent implements OnChanges, OnDestroy {

  @Input() listenerOptions: ListenerOptions;
  @Input() map: MapLibreMap;

  @Output() featureSelectionsChange = new EventEmitter<FeatureData[]>();

  @Output() featuresClick = new EventEmitter<FeaturesClickEventData>();
  @Output() featuresHoverChange = new EventEmitter<FeaturesHoverChangeEventData>();

  // CONTINUE ROKAS-502: Add overlay on hover
  overlayVisible = false;
  overlayFeature: FeatureData;
  overlayPosition: LngLatLike;

  private destroyed = new Subject<void>();
  private watchOnLayers = new Map<string, FeatureDataType>();
  private mapCursorStyleEvent: MapCursorStyleEvent;
  private featuresHoverEvent: FeaturesHoverEvent;
  private featuresClickEvent: FeaturesClickEvent;
  private featureSelectionHandler: FeatureSelectionHandler;

  constructor(
    private mapStationService: MapStationService,
    private mapRoutesService: MapRoutesService,
    private mapMarkerService: MapMarkerService,
  ) {
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    this.mapCursorStyleEvent?.complete();
    this.featuresHoverEvent?.complete();
    this.featuresClickEvent?.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.listenerOptions && this.map) {
      this.watchOnLayers.clear();

      if (this.listenerOptions.MARKER?.watch) {
        this.mapMarkerService.allMarkerAndClusterLayers.forEach(id => this.watchOnLayers.set(id, FeatureDataType.MARKER));
      }
      if (this.listenerOptions.ROUTE?.watch) {
        MapRoutesService.allRouteLayers.forEach(id => this.watchOnLayers.set(id, FeatureDataType.ROUTE));
      }
      if (this.listenerOptions.STATION?.watch) {
        this.watchOnLayers.set(MapStationService.STATION_LAYER, FeatureDataType.STATION);
        this.mapStationService.registerStationUpdater(this.map);
      } else {
        this.mapStationService.deregisterStationUpdater(this.map);
      }

      this.mapCursorStyleEvent?.complete();
      this.mapCursorStyleEvent = new MapCursorStyleEvent(this.map, [...this.watchOnLayers.keys()]);

      const selectionModes = this.listenerOptionsToSelectionModes();
      this.featureSelectionHandler = new FeatureSelectionHandler(this.map, this.watchOnLayers, selectionModes);

      if (!this.featuresClickEvent) {
        this.featuresClickEvent = new FeaturesClickEvent(this.map, this.watchOnLayers);
        this.featuresClickEvent
          .pipe(takeUntil(this.destroyed))
          .subscribe(data => this.featureClicked(data));
      }

      if (!this.featuresHoverEvent) {
        this.featuresHoverEvent = new FeaturesHoverEvent(this.map, this.watchOnLayers);
        this.featuresHoverEvent
          .pipe(takeUntil(this.destroyed))
          .subscribe(data => this.featureHovered(data));
      }
    }
  }

  private listenerOptionsToSelectionModes() {
    const selectionModes = new Map<FeatureDataType, SelectionMode>();
    selectionModes.set(FeatureDataType.ROUTE, this.listenerOptions.ROUTE.selectionMode);
    selectionModes.set(FeatureDataType.MARKER, this.listenerOptions.MARKER.selectionMode);
    selectionModes.set(FeatureDataType.STATION, this.listenerOptions.STATION.selectionMode);
    return selectionModes;
  }

  overlayOptions(): any {
    if (this.listenerOptions && this.overlayFeature) {
      return this.listenerOptions[this.overlayFeature.featureDataType] ?? {};
    }

    return {};
  }

  private featureClicked(data: FeaturesClickEventData) {
    this.featureSelectionHandler.toggleSelection(data);
    this.featureSelectionsChange.next(this.featureSelectionHandler.findSelectedFeatures());
    this.featuresClick.next(data);

    const topMostFeature = data.features[0];
    const template = this.listenerOptions[topMostFeature.featureDataType]?.clickTemplate;
    if (template) {
      this.overlayVisible = true;
      this.overlayFeature = topMostFeature;
      if (topMostFeature.geometry.type === 'Point') {
        this.overlayPosition = topMostFeature.geometry.coordinates as LngLatLike;
      } else {
        this.overlayPosition = data.clickLngLat;
      }
    } else {
      this.overlayVisible = false;
    }
  }

  private featureHovered(data: FeaturesHoverChangeEventData) {
    this.featuresHoverChange.next(data);
  }
}
