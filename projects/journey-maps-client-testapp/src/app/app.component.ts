import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MarkerCategory} from '../../../journey-maps-client/src/lib/model/marker-category.enum';
import {LngLatLike, Map} from 'maplibre-gl';
import {AssetReaderService} from './services/asset-reader.service';
import {MarkerColor} from '../../../journey-maps-client/src/lib/model/marker-color.enum';
import {BehaviorSubject, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {StyleMode} from '../../../journey-maps-client/src/lib/model/style-mode.enum';
import {
  FeatureSelection,
  InteractionOptions,
  JourneyMapsRoutingOptions,
  ListenerOptions,
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

  private _journey: GeoJSON.FeatureCollection;
  private _transferLuzern: GeoJSON.FeatureCollection;
  private _transferZurichIndoor: GeoJSON.FeatureCollection;
  private _transferBernIndoor: GeoJSON.FeatureCollection;
  private _transferGeneveIndoor: GeoJSON.FeatureCollection;
  private _routes: GeoJSON.FeatureCollection[] = [];
  private destroyed = new Subject<void>();

  apiKey: string = null;
  interactionOptions: InteractionOptions = {
    oneFingerPan: true,
    scrollZoom: true,
  };
  uiOptions: UIOptions = {
    levelSwitch: true,
    zoomControls: true,
    basemapSwitch: true,
    homeButton: true,
  };
  selectedMarkerId: string;
  visibleLevels$ = new BehaviorSubject<number[]>([]);
  selectedLevel = 0;
  selectedFeatures: FeatureSelection[] = [];
  viewportOptions: ViewportOptions = {};
  styleOptions: StyleOptions = {brightId: 'base_bright_v2_ki_casa'};

  listenerOptions: ListenerOptions = {
    MARKER: {watch: true},
    ROUTE: {watch: true},
    STATION: {watch: true}
  };

  journeyMapsGeoJsonOptions = ['journey', 'transfer luzern', 'transfer zurich', 'transfer bern', 'transfer geneve', 'routes'];
  journeyMapsRoutingOption: JourneyMapsRoutingOptions;

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
      .subscribe(json => this._routes = json);

    this.assetReaderService.loadAssetAsString('secrets/apikey.txt')
      .subscribe(apiKey => this.apiKey = apiKey);

    this.mapCenterChange.pipe(takeUntil(this.destroyed)).subscribe(mapCenter => this.mapCenter = mapCenter);
  }

  ngAfterViewInit() {
    this.listenerOptions.STATION.clickTemplate = this.stationTemplate;
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

  setSelectedFeatures(selectedFeatures: FeatureSelection[]): void {
    console.debug(selectedFeatures);
    this.selectedFeatures = selectedFeatures;
  }

  setGeoJsonInput(event: Event): void {
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
    if ((event.target as HTMLOptionElement).value === 'routes') {
      this.journeyMapsRoutingOption = {routes: this._routes};
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

  setPopupInput(event: Event): void {
    this.selectedMarkerId = undefined;
    this.markerOptions = {
      ...this.markerOptions,
      popup: (event.target as HTMLOptionElement).value === 'true',
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
    console.debug('new:', data.features?.map(f => JSON.stringify(f.state)));
  }

  updateListenerOptions(): void {
    this.listenerOptions = {...this.listenerOptions};
  }

  logSelection(selection: FeatureSelection[]) {
    console.log(JSON.stringify(selection));
  }
}
