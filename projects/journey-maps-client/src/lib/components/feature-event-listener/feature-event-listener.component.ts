import {Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges} from '@angular/core';
import {FeatureDataType, FeaturesClickEventData, FeaturesHoverChangeEventData, ListenerOptions} from '../../journey-maps-client.interfaces';
import {MapCursorStyleEvent} from '../../services/map/events/map-cursor-style-event';
import {MapStationService} from '../../services/map/map-station.service';
import {FeaturesClickEvent} from '../../services/map/events/features-click-event';
import {takeUntil} from 'rxjs/operators';
import {Map as MapLibreMap} from 'maplibre-gl';
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

  @Output() featuresClick = new EventEmitter<FeaturesClickEventData>();
  @Output() featuresHoverChange = new EventEmitter<FeaturesHoverChangeEventData>();

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

      if (this.listenerOptions.watchMarkers) {
        this.mapMarkerService.allMarkerAndClusterLayers.forEach(id => this.watchOnLayers.set(id, FeatureDataType.MARKER));
      }
      if (this.listenerOptions.watchRoutes) {
        this.mapRoutesService.allRouteLayers.forEach(id => this.watchOnLayers.set(id, FeatureDataType.ROUTE));
      }
      if (this.listenerOptions.watchStations) {
        this.watchOnLayers.set(MapStationService.STATION_LAYER, FeatureDataType.STATION);
        this.mapStationService.registerStationUpdater(this.map);
      } else {
        this.mapStationService.deregisterStationUpdater(this.map);
      }

      this.mapCursorStyleEvent?.complete();
      this.mapCursorStyleEvent = new MapCursorStyleEvent(this.map, [...this.watchOnLayers.keys()]);
      this.featureSelectionHandler = new FeatureSelectionHandler(this.map, [...this.watchOnLayers.keys()]);

      if (!this.featuresClickEvent) {
        this.featuresClickEvent = new FeaturesClickEvent(this.map, this.watchOnLayers);
        this.featuresClickEvent
          .pipe(takeUntil(this.destroyed))
          .subscribe(eventData => {
            this.featureSelectionHandler.toggleSelection(eventData);
            this.featuresClick.next(eventData);
          });
      }

      if (!this.featuresHoverEvent) {
        this.featuresHoverEvent = new FeaturesHoverEvent(this.map, this.watchOnLayers);
        this.featuresHoverEvent
          .pipe(takeUntil(this.destroyed))
          .subscribe(eventData => this.featuresHoverChange.next(eventData),);
      }
    }
  }
}
