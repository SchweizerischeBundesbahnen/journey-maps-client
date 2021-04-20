import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {LngLatBounds, LngLatBoundsLike, LngLatLike, Map as MapboxMap, MapLayerMouseEvent} from 'mapbox-gl';
import {MapInitService} from './services/map/map-init.service';
import {ReplaySubject, Subject} from 'rxjs';
import {debounceTime, delay, filter, map, take, takeUntil} from 'rxjs/operators';
import {MapMarkerService} from './services/map/map-marker.service';
import {Constants} from './services/constants';
import {Marker} from './model/marker';
import {LocaleService} from './services/locale.service';
import {ResizedEvent} from 'angular-resize-event';
import {bufferTimeOnValue} from './services/bufferTimeOnValue';
import {MapService} from './services/map/map.service';
import {MapJourneyService} from './services/map/map-journey.service';
import {MapTransferService} from './services/map/map-transfer.service';
import {MapRoutesService} from './services/map/map-routes.service';
import {MapConfigService} from './services/map/map-config.service';

/**
 * This component uses the Mapbox GL JS api to render a map and display the given data on the map.
 * <example-url>/</example-url>
 */
@Component({
  selector: 'rokas-journey-maps-client',
  templateUrl: './journey-maps-client.component.html',
  styleUrls: ['./journey-maps-client.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JourneyMapsClientComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  private map: MapboxMap;
  @ViewChild('map') private mapElementRef: ElementRef;

  /**
   * Custom <code>ng-template</code> for the marker details. (Popup or Teaser)
   * See examples for details.
   *
   * <b>NOTE:</b> This does not work - at the moment - when using the Web Component version of the library.
   */
  @Input() markerDetailsTemplate?: TemplateRef<any>;

  /** Your personal API key. Ask <a href="mailto:dlrokas@sbb.ch">dlrokas@sbb.ch</a> if you need one. */
  @Input() apiKey: string;

  /** Overwrite this value if you want to use a custom style id. */
  @Input() styleId = 'base_bright_v2_ki';

  /**
   * Overwrite this value if you want to use a style from a different source.
   * Actually you should not need this.
   */
  @Input() styleUrl = 'https://journey-maps-tiles.geocdn.sbb.ch/styles/{styleId}/style.json?api_key={apiKey}';

  /** If the search bar - to filter markers - should be enabled or not. */
  @Input() enableSearchBar = true;

  /**
   * The initial center of the map. You should pass an array with two numbers.
   * The first one is the longitude and the second one the latitude.
   */
  @Input() mapCenter?: LngLatLike;

  /** The initial zoom level of the map. */
  @Input() zoomLevel?: number;

  /** Should show level switch control or not. */
  @Input() showLevelSwitch = false;

  /** The initial bounding box of the map. */
  @Input() boundingBox?: LngLatBoundsLike;
  /** The amount of padding in pixels to add to the given boundingBox. */
  @Input() boundingBoxPadding = 0;

  /** Wrap all markers in view if true. */
  @Input() zoomToMarkers?: boolean;

  /**
   * GeoJSON as returned by the <code>/journey</code> operation of Journey Maps.
   * All routes and transfers will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time
   */
  @Input() journey: GeoJSON.FeatureCollection;

  /**
   * GeoJSON as returned by the <code>/transfer</code> operation of Journey Maps.
   * The transfer will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time
   */
  @Input() transfer: GeoJSON.FeatureCollection;

  /**
   * An array of GeoJSON objects as returned by the <code>/route</code> and <code>/routes</code> operation of Journey Maps.
   * All routes will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time
   */
  @Input() routes: GeoJSON.FeatureCollection[];

  /** The list of markers (points) that will be displayed on the map. */
  @Input() markers: Marker[];
  private _selectedMarker: Marker;

  /** By default, you get a message-overlay if you try to pan with one finger */
  @Input() allowOneFingerPan = false;

  /** Open a popup - instead of the teaser - when selecting a marker. */
  @Input() popup = false;

  /**
   * This event is emitted whenever the zoom level of the map has changed.
   */
  @Output() zoomLevelChanged = new EventEmitter<number>();
  private zoomLevelChangeDebouncer = new Subject<void>();
  /**
   * This event is emitted whenever the center of the map has changed. (Whenever the map has been moved)
   */
  @Output() mapCenterChanged = new EventEmitter<LngLatLike>();
  /**
   * This event is emitted whenever a marker, with property triggerEvent, is selected or unselected.
   */
  @Output() selectedMarkerIdChange = new EventEmitter<string>();

  private mapCenterChangeDebouncer = new Subject<void>();
  private windowResized = new Subject<void>();
  private destroyed = new Subject<void>();
  private cursorChanged = new ReplaySubject<boolean>(1);
  private clusterClicked = new ReplaySubject<MapLayerMouseEvent>(1);
  private layerClicked = new ReplaySubject<MapLayerMouseEvent>(1);
  private styleLoaded = new ReplaySubject(1);
  private mapParameterChanged = new Subject<void>();
  mapReady = new ReplaySubject<MapboxMap>(1);

  // visible for testing
  touchEventCollector = new Subject<TouchEvent>();
  public touchOverlayText: string;
  public touchOverlayStyleClass = '';

  // map.isStyleLoaded() returns sometimes false when sources are being updated.
  // Therefore we set this variable to true once the style has been loaded.
  private isStyleLoaded = false;

  /** @internal */
  constructor(private mapInitService: MapInitService,
              private mapConfigService: MapConfigService,
              private mapService: MapService,
              private mapMarkerService: MapMarkerService,
              private mapJourneyService: MapJourneyService,
              private mapTransferService: MapTransferService,
              private mapRoutesService: MapRoutesService,
              private cd: ChangeDetectorRef,
              private i18n: LocaleService) {
  }

  onTouchStart(event: TouchEvent): void {
    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    if (!this.allowOneFingerPan) {
      this.map.dragPan.disable();
    }
    this.touchEventCollector.next(event);
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchOverlayStyleClass = '';
    this.touchEventCollector.next(event);
  }

  get language(): string {
    return this.i18n.language;
  }

  /**
   * The language used for localized labels.
   * Allowed values are <code>de</code>, <code>fr</code>, <code>it</code>, <code>en</code>.
   * @param value language to set
   */
  @Input()
  set language(value: string) {
    if (value == null) {
      throw new TypeError('language mustn\'t be null');
    }

    value = value.toLowerCase();
    if (value === 'de' || value === 'fr' || value === 'it' || value === 'en') {
      this.i18n.language = value;
    } else {
      throw new TypeError('Illegal value for language. Allowed values are de|fr|it|en.');
    }
  }

  public set selectedMarker(value: Marker) {
    if (value && (value.triggerEvent || value.triggerEvent === undefined)) {
      this.selectedMarkerIdChange.emit(value.id);
    } else {
      this.selectedMarkerIdChange.emit(undefined);
    }
    if (value && value.markerUrl) {
      open(value.markerUrl, '_self'); // Do we need to make target configurable ?
    } else {
      this._selectedMarker = value;
    }
  }

  public get selectedMarker(): Marker {
    return this._selectedMarker;
  }

  private updateMarkers(): void {
    this.selectedMarker = this.markers?.find(marker => this.selectedMarker?.id === marker.id);

    this.executeWhenMapStyleLoaded(() => {
      this.mapMarkerService.updateMarkers(this.map, this.markers, this.selectedMarker);
      this.cd.detectChanges();
    });
  }

  private executeWhenMapStyleLoaded(callback: () => void): void {
    if (this.isStyleLoaded) {
      callback();
    } else {
      this.styleLoaded.pipe(
        take(1),
        delay(500)
      ).subscribe(() => callback());
    }
  }

  get getMarkersBounds(): LngLatBounds {
    return this.zoomToMarkers ? this.computeMarkersBounds(this.markers) : undefined;
  }

  /**
   * Select one of the markers contained in {@link JourneyMapsClientComponent#markers}
   *
   * Allowed values are either the ID of a marker to select or <code>undefined</code> to unselect.
   *
   * @param value the ID of the marker to select or <code>undefined</code> to unselect the marker
   */
  @Input()
  set selectedMarkerId(value: string | undefined) {
    if (!!value) {
      const selectedMarker = this.markers?.find(marker => marker.id === value);
      this.onMarkerSelected(selectedMarker);
    } else if (!!this.selectedMarker) {
      this.onMarkerUnselected();
    }
  }

  get selectedMarkerId(): string {
    return this._selectedMarker?.id;
  }

  ngOnInit(): void {
    this.validateInputParameter();
    this.setupSubjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mapConfigService.updateConfigs(
      this.popup,
      this.allowOneFingerPan,
      this.enableSearchBar,
      this.showLevelSwitch,
    );

    if (changes.markers) {
      this.updateMarkers();
    }

    // handle journey, transfer, and routes together, otherwise they can overwrite each other's transfer or route data
    if (changes.journey || changes.transfer || changes.routes) {
      this.executeWhenMapStyleLoaded(() => {
        // remove previous data from map
        this.mapJourneyService.updateJourney(this.map, undefined);
        this.mapTransferService.updateTransfer(this.map, undefined);
        this.mapRoutesService.updateRoutes(this.map, undefined);
        // only add new data if we have some
        if (changes.journey?.currentValue) {
          this.mapJourneyService.updateJourney(this.map, this.journey);
        }
        if (changes.transfer?.currentValue) {
          this.mapJourneyService.updateJourney(this.map, this.transfer);
        }
        if (changes.routes?.currentValue) {
          this.mapRoutesService.updateRoutes(this.map, this.routes);
        }
      });
    }

    if ([this.transfer, this.journey, this.routes].filter(Boolean).length > 1) {
      console.warn('Use either transfer or journey or routes. It does not work correctly when more than one of these properties is set.');
    }

    if (!this.isStyleLoaded) {
      return;
    }

    if (changes.mapCenter || changes.zoomLevel || changes.boundingBox || changes.zoomToMarkers) {
      this.mapParameterChanged.next();
    }
  }

  ngAfterViewInit(): void {
    // CHECKME ses: Lazy initialization with IntersectionObserver?
    const styleUrl = this.styleUrl
      .replace('{styleId}', this.styleId)
      .replace('{apiKey}', this.apiKey);

    this.touchOverlayText = this.i18n.getText('touchOverlay.tip');
    this.mapInitService.initializeMap(
      this.mapElementRef.nativeElement,
      this.i18n.language,
      styleUrl,
      this.zoomLevel,
      this.mapCenter,
      this.boundingBox ?? this.getMarkersBounds,
      this.boundingBox ? this.boundingBoxPadding : Constants.MARKER_BOUNDS_PADDING,
      this.allowOneFingerPan,
    ).subscribe(
      m => {
        this.map = m;
        if (this.map.isStyleLoaded()) {
          this.isStyleLoaded = true;
          this.styleLoaded.next();
        } else {
          this.map.on('styledata', () => {
            this.isStyleLoaded = true;
            this.styleLoaded.next();
          });
        }
        this.executeWhenMapStyleLoaded(() => this.onStyleLoaded());
      }
    );

    this.touchEventCollector.pipe(
      bufferTimeOnValue(200),
      takeUntil(this.destroyed)
    ).subscribe(touchEvents => {

      const containsTwoFingerTouch = touchEvents.some(touchEvent => touchEvent.touches.length === 2);
      const containsTouchEnd = touchEvents.some(touchEvent => touchEvent.type === 'touchend');

      if (!(containsTwoFingerTouch || containsTouchEnd) && !this.allowOneFingerPan) {
        this.touchOverlayStyleClass = 'is_visible';
        this.cd.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private setupSubjects(): void {
    this.windowResized.pipe(
      debounceTime(500),
      takeUntil(this.destroyed)
    ).subscribe(() => this.map.resize());

    this.cursorChanged.pipe(
      debounceTime(50),
      takeUntil(this.destroyed)
    ).subscribe(isEnter => this.map.getCanvas().style.cursor = isEnter ? 'pointer' : '');

    this.layerClicked.pipe(
      filter(e => e?.features != null && e.features.length > 0),
      map(e => e.features),
      // CHECKME ses: When setting debounceTime as first operator then e.features is always undefined... Why?
      debounceTime(200),
      takeUntil(this.destroyed)
    ).subscribe(features => {
      const selectedMarkerId = this.mapMarkerService.onLayerClicked(this.map, features[0], this.selectedMarker?.id);
      this.selectedMarker = this.markers.find(marker => marker.id === selectedMarkerId && !!selectedMarkerId);
      this.cd.detectChanges();
    });

    this.clusterClicked.pipe(
      debounceTime(200),
      filter(e => e != null),
      map(e => this.map.queryRenderedFeatures(e.point, {layers: [Constants.CLUSTER_LAYER]})),
      filter(features => features != null && features.length > 0),
      takeUntil(this.destroyed)
    ).subscribe(features => this.mapMarkerService.onClusterClicked(this.map, features[0]));

    this.mapParameterChanged.pipe(
      debounceTime(200),
      takeUntil(this.destroyed)
    ).subscribe(() => this.mapService.moveMap(this.map,
      this.mapCenter,
      this.zoomLevel,
      this.boundingBox ?? this.getMarkersBounds,
      this.boundingBox ? this.boundingBoxPadding : Constants.MARKER_BOUNDS_PADDING));

    this.zoomLevelChangeDebouncer.pipe(
      debounceTime(200),
      takeUntil(this.destroyed)
    ).subscribe(() => this.zoomLevelChanged.emit(this.map.getZoom()));

    this.mapCenterChangeDebouncer.pipe(
      debounceTime(200),
      takeUntil(this.destroyed)
    ).subscribe(() => this.mapCenterChanged.emit(this.map.getCenter()));
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowResized.next();
  }

  onResized(event: ResizedEvent): void {
    if (this.map) {
      this.map.resize();
    }
  }

  private onStyleLoaded(): void {
    this.mapReady.next(this.map);

    this.map.resize();
    this.mapService.verifySources(this.map);
    for (const layer of Constants.MARKER_AND_CLUSTER_LAYERS) {
      this.map.on('mouseenter', layer, () => this.cursorChanged.next(true));
      this.map.on('mouseleave', layer, () => this.cursorChanged.next(false));
    }

    for (const infoLayer of Constants.MARKER_LAYERS) {
      this.map.on('click', infoLayer, event => this.layerClicked.next(event));
    }

    this.map.on('click', Constants.CLUSTER_LAYER, event => this.clusterClicked.next(event));
    this.map.on('zoomend', () => this.zoomLevelChangeDebouncer.next());
    this.map.on('moveend', () => this.mapCenterChangeDebouncer.next());
    // CHECKME ses: Handle missing map image
  }

  /** @internal */
  // When a marker has been unselected from outside the map.
  onMarkerUnselected(): void {
    this.selectedMarker = undefined;
    this.mapMarkerService.unselectFeature(this.map);
    this.cd.detectChanges();
  }

  private validateInputParameter(): void {
    if (!this.apiKey) {
      throw new Error('Input parameter apiKey is mandatory');
    }
  }

  /** @internal */
  // When a marker has been selected from outside the map.
  onMarkerSelected(marker: Marker): void {
    if (marker?.id !== this.selectedMarker?.id) {
      this.selectedMarker = marker;
      this.mapMarkerService.selectMarker(this.map, marker);
      this.cd.detectChanges();
    }
  }

  /** @internal */
  computeMarkersBounds(markers: Marker[]): LngLatBounds {
    const bounds = new LngLatBounds();
    markers.forEach((marker: Marker) => {
      bounds.extend(marker.position as LngLatLike);
    });
    return bounds;
  }
}
