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
  ViewChild,
} from '@angular/core';
import {LngLatBounds, LngLatLike, Map as MapboxMap, MapLayerMouseEvent} from 'mapbox-gl';
import {MapInitService} from './services/map/map-init.service';
import {ReplaySubject, Subject} from 'rxjs';
import {debounceTime, delay, filter, map, switchMap, take, takeUntil} from 'rxjs/operators';
import {MapMarkerService} from './services/map/map-marker.service';
import {Constants} from './services/constants';
import {Marker} from './model/marker';
import {LocaleService} from './services/locale.service';
import {bufferTimeOnValue} from './services/bufferTimeOnValue';
import {Direction, MapService} from './services/map/map.service';
import {MapJourneyService} from './services/map/map-journey.service';
import {MapTransferService} from './services/map/map-transfer.service';
import {MapRoutesService} from './services/map/map-routes.service';
import {MapConfigService} from './services/map/map-config.service';
import {MapLeitPoiService} from './services/map/map-leit-poi.service';
import {StyleMode} from './model/style-mode.enum';
import {LevelSwitchService} from './components/level-switch/services/level-switch.service';
import {MovementControls, InitialSettings, JourneyMapsGeoJsonOption, Styles, Selections} from './journey-maps-client.interfaces';

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

  private defaultStyles: Styles = {
    brightId: 'base_bright_v2_ki',
    darkId: 'base_dark_v2_ki',
    url: 'https://journey-maps-tiles.geocdn.sbb.ch/styles/{styleId}/style.json?api_key={apiKey}',
    mode: StyleMode.BRIGHT,
  };
  /**
   * Settings to control the map (bright and dark) styles
   */
  @Input()
  get styles(): Styles {
    return this._styles;
  }
  set styles(styles: Styles) {
    this._styles = {
      ...this.defaultStyles,
      ...styles,
    };
  }
  private _styles: Styles = this.defaultStyles;

  /** Whether the search bar - to filter markers - should be shown or not. */
  @Input() enableSearchBar = true;

  private defaultMovementControls: MovementControls = {
    showLevelSwitch: false,
    showZoomControls: false,
    /** By default, you get a message-overlay if you try to pan with one finger. */
    allowOneFingerPan: false,
    allowScrollZoom: false,
  };
  /**
   * Settings to control the movement of the map
   */
  @Input()
  get movementControls(): MovementControls {
    return this._movementControls;
  }
  set movementControls(movementControls: MovementControls) {
    this._movementControls = {
      ...this.defaultMovementControls,
      ...movementControls,
    };
  }
  private _movementControls: MovementControls = this.defaultMovementControls;

  private defaultInitialSettings: InitialSettings = {
    boundingBoxPadding: 0,
  };
  /**
   * Settings that control what portion of the map is shown initially
   */
  @Input()
  get initialSettings(): InitialSettings {
    return this._initialSettings;
  }
  set initialSettings(initialSettings: InitialSettings) {
    this._initialSettings = {
      ...this.defaultInitialSettings,
      ...initialSettings,
    };
  }
  private _initialSettings: InitialSettings = this.defaultInitialSettings;

  /**
   * Input to display GeoJson data on the map.
   */
  @Input() journeyMapsGeoJson: JourneyMapsGeoJsonOption;

  /**
   * Inputs that can be used to programmatically select things on the map
   */
  @Input()
  get selections(): Selections {
    return this._selections;
  }
  set selections(selections: Selections) {
    this._selections = {
      ...this._selections,
      ...selections,
    };
  }
  private _selections: Selections = {};


  /** The list of markers (points) that will be displayed on the map. */
  @Input() markers: Marker[];

  /** Open a popup - instead of the teaser - when selecting a marker. */
  @Input() popup = false;

  /**
   * The language used for localized labels.
   * Allowed values are <code>de</code>, <code>fr</code>, <code>it</code>, <code>en</code>.
   * @param value language to set
   */
  @Input()
  get language(): string {
    return this.i18n.language;
  }
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

  /**
   * This event is emitted whenever one of the {@link Selections} changes
   */
  @Output() selectionsChange = new EventEmitter<Selections>();
  /**
   * This event is emitted whenever the min zoom level of the map has changed.
   */
  @Output() minZoomLevelChange = new EventEmitter<number>();
  /**
   * This event is emitted whenever the max zoom level of the map has changed.
   */
  @Output() maxZoomLevelChange = new EventEmitter<number>();
  /**
   * This event is emitted whenever the zoom level of the map has changed.
   */
  @Output() zoomLevelChange = new EventEmitter<number>();
  private zoomLevelChangeDebouncer = new Subject<void>();
  /**
   * This event is emitted whenever the center of the map has changed. (Whenever the map has been moved)
   */
  @Output() mapCenterChange = new EventEmitter<LngLatLike>();
  /**
   * This event is emitted whenever the map is ready.
   */
  @Output() mapReady = new ReplaySubject<MapboxMap>(1);
  /**
   * This event is emitted whenever the list of available (floor-) levels changes
   */
  @Output() visibleLevelsChange = new EventEmitter<number[]>();

  private mapCenterChangeDebouncer = new Subject<void>();
  private windowResized = new Subject<void>();
  private destroyed = new Subject<void>();
  private cursorChanged = new ReplaySubject<boolean>(1);
  private mapClicked = new ReplaySubject<MapLayerMouseEvent>(1);
  private styleLoaded = new ReplaySubject(1);
  private initialSettingsChanged = new Subject<void>();
  private mapStyleModeChanged = new Subject<void>();

  // visible for testing
  touchEventCollector = new Subject<TouchEvent>();
  public touchOverlayText: string;
  public touchOverlayStyleClass = '';

  // map.isStyleLoaded() returns sometimes false when sources are being updated.
  // Therefore we set this variable to true once the style has been loaded.
  private isStyleLoaded = false;

  private _selectedMarker: Marker;

  /** @internal */
  constructor(private mapInitService: MapInitService,
              private mapConfigService: MapConfigService,
              private mapService: MapService,
              private mapMarkerService: MapMarkerService,
              private mapJourneyService: MapJourneyService,
              private mapTransferService: MapTransferService,
              private mapRoutesService: MapRoutesService,
              private mapLeitPoiService: MapLeitPoiService,
              private levelSwitchService: LevelSwitchService,
              private cd: ChangeDetectorRef,
              private i18n: LocaleService,
              private host: ElementRef) {
    // binding of 'this' is needed for elements/webcomponent
    // https://github.com/angular/angular/issues/22114#issuecomment-569311422
    this.host.nativeElement.moveNorth = this.moveNorth.bind(this);
    this.host.nativeElement.moveEast = this.moveEast.bind(this);
    this.host.nativeElement.moveSouth = this.moveSouth.bind(this);
    this.host.nativeElement.moveWest = this.moveWest.bind(this);
  }

  onTouchStart(event: TouchEvent): void {
    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    if (!this.movementControls.allowOneFingerPan) {
      this.map.dragPan.disable();
    }
    this.touchEventCollector.next(event);
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchOverlayStyleClass = '';
    this.touchEventCollector.next(event);
  }

  public set selectedMarker(value: Marker) {
    if (value && (value.triggerEvent || value.triggerEvent === undefined)) {
      this.selections = {selectedMarkerId: value.id};
      this.selectionsChange.emit(this.selections);
    } else {
      this.selections = {selectedMarkerId: undefined};
      this.selectionsChange.emit(this.selections);
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

  /**
   * Move the map North as if pressing the up arrow key on the keyboard
   */
  public moveNorth(): void {
    this.mapService.pan(this.map, Direction.NORTH);
  }

  /**
   * Move the map East as if pressing the right arrow key on the keyboard
   */
  public moveEast(): void {
    this.mapService.pan(this.map, Direction.EAST);
  }

  /**
   * Move the map South as if pressing the down arrow key on the keyboard
   */
  public moveSouth(): void {
    this.mapService.pan(this.map, Direction.SOUTH);
  }

  /**
   * Move the map West as if pressing the left arrow key on the keyboard
   */
  public moveWest(): void {
    this.mapService.pan(this.map, Direction.WEST);
  }

  private updateMarkers(): void {
    this.selectedMarker = this.markers?.find(marker => this.selectedMarker?.id === marker.id);
    this.executeWhenMapStyleLoaded(() => {
      this.mapMarkerService.updateMarkers(this.map, this.markers, this.selectedMarker, this.styles.mode);
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
    return this.initialSettings.zoomToMarkers ? this.computeMarkersBounds(this.markers) : undefined;
  }

  ngOnInit(): void {
    this.validateInputParameter();
    this.setupSubjects();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mapConfigService.updateConfigs(
      this.popup,
    );

    if (changes.markers) {
      this.updateMarkers();
    }

    // handle journey, transfer, and routes together, otherwise they can overwrite each other's transfer or route data
    if (changes.journeyMapsGeoJson) {
      this.executeWhenMapStyleLoaded(() => {
        // remove previous data from map
        this.mapJourneyService.updateJourney(this.map, undefined);
        this.mapTransferService.updateTransfer(this.map, undefined);
        this.mapRoutesService.updateRoutes(this.map, undefined);
        this.mapLeitPoiService.processData(this.map, undefined);
        // only add new data if we have some
        if (changes.journeyMapsGeoJson?.currentValue?.journey) {
          this.mapJourneyService.updateJourney(this.map, this.journeyMapsGeoJson.journey);
        }
        if (changes.journeyMapsGeoJson?.currentValue?.transfer) {
          this.mapTransferService.updateTransfer(this.map, this.journeyMapsGeoJson.transfer);
          this.mapLeitPoiService.processData(this.map, this.journeyMapsGeoJson.transfer);
        }
        if (changes.journeyMapsGeoJson?.currentValue?.routes) {
          this.mapRoutesService.updateRoutes(this.map, this.journeyMapsGeoJson.routes);
        }
      });
    }

    if (Object.keys(this.journeyMapsGeoJson || {}).length > 1) {
      console.error('journeyMapsGeoJson: Use either transfer or journey or routes. It does not work correctly when more than one of these properties is set.');
    }

    if (!this.isStyleLoaded) {
      return;
    }

    if (changes.initialSettings) {
      this.initialSettingsChanged.next();
    }

    if (changes.styles?.currentValue?.mode !== changes.styles?.previousValue?.mode) {
      this.mapStyleModeChanged.next();
    }

    if (changes.selections?.currentValue.selectedLevel !== undefined) {
      this.levelSwitchService.switchLevel(this.selections.selectedLevel);
    }

    if (changes.selections?.currentValue.selectedMarkerId !== changes.selections?.previousValue.selectedMarkerId) {
      const newValue = this.selections.selectedMarkerId;
      if (!!newValue) {
        const selectedMarker = this.markers?.find(marker => marker.id === newValue);
        this.onMarkerSelected(selectedMarker);
      } else if (!!this.selectedMarker) {
        this.onMarkerUnselected();
      }
    }
  }

  ngAfterViewInit(): void {
    // CHECKME ses: Lazy initialization with IntersectionObserver?
    const styleUrl = this.getStyleUrl();

    this.touchOverlayText = this.i18n.getText('touchOverlay.tip');
    this.mapInitService.initializeMap(
      this.mapElementRef.nativeElement,
      this.i18n.language,
      styleUrl,
      this.movementControls.allowScrollZoom,
      this.initialSettings.zoomLevel,
      this.initialSettings.mapCenter,
      this.initialSettings.boundingBox ?? this.getMarkersBounds,
      this.initialSettings.boundingBox ? this.initialSettings.boundingBoxPadding : Constants.MARKER_BOUNDS_PADDING,
      this.movementControls.allowOneFingerPan,
    ).subscribe(
      m => {
        this.map = m;
        if (this.map.isStyleLoaded()) {
          this.onStyleLoaded();
        } else {
          this.map.on('styledata', () => {
            this.onStyleLoaded();
          });
        }
      }
    );

    this.touchEventCollector.pipe(
      bufferTimeOnValue(200),
      takeUntil(this.destroyed)
    ).subscribe(touchEvents => {

      const containsTwoFingerTouch = touchEvents.some(touchEvent => touchEvent.touches.length === 2);
      const containsTouchEnd = touchEvents.some(touchEvent => touchEvent.type === 'touchend');

      if (!(containsTwoFingerTouch || containsTouchEnd) && !this.movementControls.allowOneFingerPan) {
        this.touchOverlayStyleClass = 'is_visible';
        this.cd.detectChanges();
      }
    });
  }

  private getStyleUrl(): string {
    return this.styles.url
      .replace('{styleId}', this.getStyleId())
      .replace('{apiKey}', this.apiKey);
  }

  private getStyleId(): string {
    return this.styles.mode === StyleMode.DARK ? this.styles.darkId : this.styles.brightId;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
    this.mapLeitPoiService.destroy();
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

    this.mapClicked.pipe(
      debounceTime(200),
      map(e => this.map.queryRenderedFeatures(e.point, {layers: this.mapMarkerService.allMarkerAndClusterLayers})),
      filter(features => features?.length > 0),
      takeUntil(this.destroyed)
    ).subscribe(features => {
      let i = 0;
      let target = features[0];

      // The topmost rendered feature should be at position 0.
      // But it doesn't work for features whithin the same layer.
      while (target.layer.id === features[++i]?.layer.id) {
        if (target.properties.order < features[i].properties.order) {
          target = features[i];
        }
      }

      if (target.properties.cluster) {
        this.mapMarkerService.onClusterClicked(this.map, target);
      } else {
        const selectedMarkerId = this.mapMarkerService.onMarkerClicked(this.map, target, this.selectedMarker?.id);
        this.selectedMarker = this.markers.find(marker => marker.id === selectedMarkerId && !!selectedMarkerId);
        this.cd.detectChanges();
      }
    });

    this.initialSettingsChanged.pipe(
      debounceTime(200),
      takeUntil(this.destroyed)
    ).subscribe(() => this.mapService.moveMap(this.map,
      this.initialSettings.mapCenter,
      this.initialSettings.zoomLevel,
      this.initialSettings.boundingBox ?? this.getMarkersBounds,
      this.initialSettings.boundingBox ? this.initialSettings.boundingBoxPadding : Constants.MARKER_BOUNDS_PADDING));

    this.mapStyleModeChanged.pipe(
      debounceTime(200),
      takeUntil(this.destroyed),
      switchMap(() => this.mapInitService.fetchStyle(this.getStyleUrl()))
    ).subscribe(style => {
        this.map.setStyle(style, {diff: false});
        this.map.once('styledata',
          () => this.mapMarkerService.updateMarkers(this.map, this.markers, this.selectedMarker, this.styles.mode));
      });

    this.zoomLevelChangeDebouncer.pipe(
      debounceTime(200),
      takeUntil(this.destroyed)
    ).subscribe(() => this.zoomLevelChange.emit(this.map.getZoom()));

    this.mapCenterChangeDebouncer.pipe(
      debounceTime(200),
      takeUntil(this.destroyed)
    ).subscribe(() => this.mapCenterChange.emit(this.map.getCenter()));

    this.levelSwitchService.selectedLevel$.subscribe(level => {
      this.selections = {selectedLevel: level};
      this.selectionsChange.emit(this.selections);
    });
    this.levelSwitchService.visibleLevels$.subscribe(levels => this.visibleLevelsChange.emit(levels));
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowResized.next();
  }

  onResized(): void {
    if (this.map) {
      this.map.resize();
    }
  }

  private onStyleLoaded(): void {
    if (this.isStyleLoaded) {
      return;
    }

    this.mapMarkerService.initStyleData(this.map);
    this.levelSwitchService.onInit(this.map);
    this.map.resize();
    // @ts-ignore
    this.mapService.verifySources(this.map, [Constants.ROUTE_SOURCE, Constants.WALK_SOURCE, ...this.mapMarkerService.sources]);

    for (const layer of this.mapMarkerService.allMarkerAndClusterLayers) {
      this.map.on('mouseenter', layer, () => this.cursorChanged.next(true));
      this.map.on('mouseleave', layer, () => this.cursorChanged.next(false));
      this.map.on('click', layer, event => this.mapClicked.next(event));
    }
    this.map.on('zoomend', () => this.zoomLevelChangeDebouncer.next());
    this.map.on('moveend', () => this.mapCenterChangeDebouncer.next());
    // Emit initial values
    this.zoomLevelChangeDebouncer.next();
    this.mapCenterChangeDebouncer.next();
    this.minZoomLevelChange.emit(MapInitService.MIN_ZOOM);
    this.maxZoomLevelChange.emit(MapInitService.MAX_ZOOM);

    this.isStyleLoaded = true;
    this.styleLoaded.next();
    this.mapReady.next(this.map);
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
