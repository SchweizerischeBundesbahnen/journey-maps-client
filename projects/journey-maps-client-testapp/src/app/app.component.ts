import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MarkerCategory} from '../../../journey-maps-client/src/lib/model/marker-category.enum';
import {LngLatLike, Map} from 'maplibre-gl';
import {AssetReaderService} from './services/asset-reader.service';
import {MarkerColor} from '../../../journey-maps-client/src/lib/model/marker-color.enum';
import {BehaviorSubject, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {StyleMode} from '../../../journey-maps-client/src/lib/model/style-mode.enum';
import {
  FeatureData,
  FeaturesSelectEventData,
  InteractionOptions,
  JourneyMapsRoutingOptions,
  ListenerOptions,
  SelectionMode,
  StyleOptions,
  UIOptions,
  ViewportOptions,
  ZoomLevels,
} from '../../../journey-maps-client/src/lib/journey-maps-client.interfaces';
import {JourneyMapsClientComponent} from '../../../journey-maps-client/src/lib/journey-maps-client.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private assetReaderService: AssetReaderService,
    private cd: ChangeDetectorRef
  ) {
  }

  @ViewChild(JourneyMapsClientComponent)
  client: JourneyMapsClientComponent;
  @ViewChild('stationTemplate')
  stationTemplate: TemplateRef<any>;
  @ViewChild('routeTemplate')
  routeTemplate: TemplateRef<any>;

  private _journey: GeoJSON.FeatureCollection;
  private _transferLuzern: GeoJSON.FeatureCollection;
  private _transferZurichIndoor: GeoJSON.FeatureCollection;
  private _transferBernIndoor: GeoJSON.FeatureCollection;
  private _transferGeneveIndoor: GeoJSON.FeatureCollection;
  private _zonesBernBurgdorf: GeoJSON.FeatureCollection;
  private _zonesBsBl: GeoJSON.FeatureCollection;
  private _routesEngelbergThun: GeoJSON.FeatureCollection[] = [];
  private _routesBnLs: GeoJSON.FeatureCollection[] = [];
  private destroyed = new Subject<void>();

  apiKey: string = null;
  interactionOptions: InteractionOptions = {
    oneFingerPan: true,
    scrollZoom: true,
  };
  uiOptions: UIOptions = {
    showSmallButtons: false,
    levelSwitch: true,
    zoomControls: true,
    basemapSwitch: true,
    homeButton: true,
  };
  selectedMarkerId: string;
  visibleLevels$ = new BehaviorSubject<number[]>([]);
  selectedLevel = 0;
  selectedFeatures: FeatureData[] = [];
  viewportOptions: ViewportOptions = {};
  styleOptions: StyleOptions = {brightId: 'base_bright_v2_ki_casa'};

  listenerOptions: ListenerOptions = {
    MARKER: {watch: true, selectionMode: SelectionMode.single},
    ROUTE: {watch: true, popup: true, selectionMode: SelectionMode.multi},
    STATION: {watch: true, popup: true},
    ZONE: {watch: true, selectionMode: SelectionMode.multi},
  };

  journeyMapsRoutingOptions = ['journey', 'transfer luzern', 'transfer zurich', 'transfer bern', 'transfer geneve', 'routes-BN-LS', 'routes-engelberg-thun'];
  journeyMapsRoutingOption: JourneyMapsRoutingOptions;
  journeyMapsZoneOptions = ['bern-burgdorf', 'bs-bl'];
  journeyMapsZones: GeoJSON.FeatureCollection;

  zoomLevels: ZoomLevels;
  mapCenter: LngLatLike;
  mapCenterChange = new Subject<LngLatLike>();
  map: Map;

  mapVisible = true;

  markerOptions = {
    popup: true,
    markers: [
      {
        id: 'velo',
        title: 'Basel - Bahnhof SBB',
        subtitle: 'Rent a Bike - Ihr Mietvelo',
        position: [7.5897, 47.5476],
        category: MarkerCategory.BICYCLEPARKING,
        color: MarkerColor.BLACK
      },
      {
        id: 'home',
        title: 'Home Office',
        subtitle: 'My home is my castle',
        position: [7.296515, 47.069815],
        category: MarkerCategory.WARNING,
        color: MarkerColor.RED,
      },
      {
        id: 'biel',
        title: 'Biel, my town, my rules !',
        position: [7.2468, 47.1368],
        category: MarkerCategory.DISRUPTION,
        color: MarkerColor.RED,
        markerUrl: 'https://www.biel-bienne.ch/',
        triggerEvent: false
      },
      {
        id: 'playground',
        title: 'Playground',
        subtitle: 'Sun, fun and nothing to do',
        position: [7.299265, 47.072120],
        category: MarkerCategory.CUSTOM,
        icon: 'assets/icons/train.png',
        iconSelected: 'assets/icons/train_selected.png',
      },
      {
        id: 'work',
        title: 'Office',
        subtitle: 'SBB Wylerpark',
        position: [7.446450, 46.961409],
        category: MarkerCategory.RAIL,
        color: MarkerColor.DARKBLUE,
      },
      {
        id: 'work2',
        title: 'Office2',
        subtitle: 'SBB Wylerpark2',
        position: [7.446490, 46.961409],
        category: MarkerCategory.RAIL,
        color: MarkerColor.DARKBLUE,
      },
    ],
  };

  ngOnInit(): void {
    this.assetReaderService.loadAssetAsJSON('journey/zh-sh_waldfriedhof.json')
      .subscribe(json => this._journey = json);

    this.assetReaderService.loadAssetAsJSON('transfer/luzern4-j.json')
      .subscribe(json => this._transferLuzern = json);

    this.assetReaderService.loadAssetAsJSON('transfer/zurich-indoor.json')
      .subscribe(json => this._transferZurichIndoor = json);

    this.assetReaderService.loadAssetAsJSON('transfer/bern-indoor.json')
      .subscribe(json => this._transferBernIndoor = json);

    this.assetReaderService.loadAssetAsJSON('transfer/geneve-indoor.json')
      .subscribe(json => this._transferGeneveIndoor = json);

    this.assetReaderService.loadAssetAsJSON('routes/engelberg-und-thun.json')
      .subscribe(json => this._routesEngelbergThun = json);

    this.assetReaderService.loadAssetAsJSON('routes/bn-ls.json')
      .subscribe(json => this._routesBnLs = json);

    this.assetReaderService.loadAssetAsJSON('zones/bern-burgdorf.json')
      .subscribe(json => this._zonesBernBurgdorf = json);

    this.assetReaderService.loadAssetAsJSON('zones/bs-bl.json')
      .subscribe(json => this._zonesBsBl = json);

    this.assetReaderService.loadAssetAsString('secrets/apikey.txt')
      .subscribe(apiKey => this.apiKey = apiKey);

    this.mapCenterChange.pipe(takeUntil(this.destroyed)).subscribe(mapCenter => this.mapCenter = mapCenter);
  }

  ngAfterViewInit() {
    this.listenerOptions.STATION.clickTemplate = this.stationTemplate;
    this.listenerOptions.ROUTE.hoverTemplate = this.routeTemplate;
    this.updateListenerOptions();
  }

  onMapRecieved(map: Map): void {
    this.map = map;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  setSelectedMarkerId(selectedMarkerId: string): void {
    this.selectedMarkerId = selectedMarkerId;
  }

  setSelectedLevel(selectedLevel: number): void {
    this.selectedLevel = selectedLevel;
  }

  setSelectedFeatures(selectedFeatures: FeatureData[]): void {
    console.debug(selectedFeatures);
    this.selectedFeatures = selectedFeatures;
  }

  setJourneyMapsRoutingInput(event: Event): void {
    this.journeyMapsRoutingOption = {};

    let bbox;
    let updateDataFunction: () => void;
    if ((event.target as HTMLOptionElement).value === 'journey') {
      updateDataFunction = () => this.journeyMapsRoutingOption = {journey: this._journey};
      bbox = this._journey.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer luzern') {
      updateDataFunction = () => this.journeyMapsRoutingOption = {transfer: this._transferLuzern};
      bbox = this._transferLuzern.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer zurich') {
      updateDataFunction = () => this.journeyMapsRoutingOption = {transfer: this._transferZurichIndoor};
      bbox = this._transferZurichIndoor.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer bern') {
      updateDataFunction = () => this.journeyMapsRoutingOption = {transfer: this._transferBernIndoor};
      bbox = this._transferBernIndoor.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer geneve') {
      updateDataFunction = () => this.journeyMapsRoutingOption = {transfer: this._transferGeneveIndoor};
      bbox = this._transferGeneveIndoor.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'routes-engelberg-thun') {
      this.journeyMapsRoutingOption = {routes: this._routesEngelbergThun};
    }
    if ((event.target as HTMLOptionElement).value === 'routes-BN-LS') {
      this.journeyMapsRoutingOption = {routes: this._routesBnLs};
    }

    if (bbox) {
      this.setBbox(bbox);
      this.mapCenterChange.pipe(take(1)).subscribe(() => {
          updateDataFunction();
          this.cd.detectChanges();
        }
      );
    }
  }

  setJourneyMapsZoneInput(event: Event): void {
    this.journeyMapsZones = undefined;

    if ((event.target as HTMLOptionElement).value === 'bern-burgdorf') {
      this.journeyMapsZones = this._zonesBernBurgdorf;
    }
    if ((event.target as HTMLOptionElement).value === 'bs-bl') {
      this.journeyMapsZones = this._zonesBsBl;
    }

    if (this.journeyMapsZones) {
      this.setBbox(this.journeyMapsZones.bbox);
    }
  }

  setPopupInput(event: Event): void {
    this.selectedMarkerId = undefined;
    this.markerOptions = {
      ...this.markerOptions,
      popup: (event.target as HTMLOptionElement).value === 'true',
    };
  }

  setShowSmallButtons(event: Event): void {
    this.uiOptions = {
      ...this.uiOptions,
      showSmallButtons: (event.target as HTMLInputElement).checked,
    };
  }

  setStyleModeInput(event: Event): void {
    this.selectedMarkerId = undefined;
    // replace the entire object to fire change detection
    this.styleOptions = {
      ...this.styleOptions,
      mode: StyleMode[(event.target as HTMLOptionElement).value],
    };
  }

  private setBbox(bbox: number[]): void {
    this.viewportOptions = {
      ...this.viewportOptions,
      boundingBox: [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
    };
  }

  log(data: any) {
    console.debug(data.features);
  }

  updateListenerOptions(): void {
    this.listenerOptions = {...this.listenerOptions};
  }

  logSelection(selection: FeaturesSelectEventData) {
    console.log(selection.features.map(s => {
      return {
        id: s.id,
        type: s.featureDataType,
        selected: s.state.selected
      };
    }));
  }
}
