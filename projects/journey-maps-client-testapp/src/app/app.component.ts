import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MarkerCategory} from '../../../journey-maps-client/src/lib/model/marker-category.enum';
import {LngLatLike, Map} from 'maplibre-gl';
import {AssetReaderService} from './services/asset-reader.service';
import {MarkerColor} from '../../../journey-maps-client/src/lib/model/marker-color.enum';
import {BehaviorSubject, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {StyleMode} from '../../../journey-maps-client/src/lib/model/style-mode.enum';
import {
  InteractionOptions,
  UIOptions,
  JourneyMapsRoutingOptions,
  StyleOptions,
  ViewportOptions,
  ZoomLevels,
} from '../../../journey-maps-client/src/lib/journey-maps-client.interfaces';
import {JourneyMapsClientComponent} from '../../../journey-maps-client/src/lib/journey-maps-client.component';
import {GeoJSON} from 'geojson';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private assetReaderService: AssetReaderService,
    private cd: ChangeDetectorRef
  ) {
  }

  @ViewChild(JourneyMapsClientComponent)
  client: JourneyMapsClientComponent;

  private _journey: GeoJSON.FeatureCollection;
  private _transferLuzern: GeoJSON.FeatureCollection;
  private _transferZurichIndoor: GeoJSON.FeatureCollection;
  private _transferBernIndoor: GeoJSON.FeatureCollection;
  private _transferGeneveIndoor: GeoJSON.FeatureCollection;
  private _areasBernBurgdorf: GeoJSON.FeatureCollection;
  private _routes: GeoJSON.FeatureCollection[] = [];
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
  viewportOptions: ViewportOptions = {};
  styleOptions: StyleOptions = {};

  journeyMapsGeoJsonOptions = ['journey', 'transfer luzern', 'transfer zurich', 'transfer bern', 'transfer geneve', 'routes', 'bern-burgdorf'];
  journeyMapsRoutingOption: JourneyMapsRoutingOptions;
  areasGeoJsonOptions = ['bern-burgdorf'];
  areas: GeoJSON.FeatureCollection;

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

    this.assetReaderService.loadAssetAsJSON('areas/bern-burgdorf.json')
      .subscribe(json => this._areasBernBurgdorf = json);

    this.assetReaderService.loadAssetAsString('secrets/apikey.txt')
      .subscribe(apiKey => this.apiKey = apiKey);

    this.mapCenterChange.pipe(takeUntil(this.destroyed)).subscribe(mapCenter => this.mapCenter = mapCenter);
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
    // works
    // if ((event.target as HTMLOptionElement).value === 'bern-burgdorf') {
    //   this.areas = this._areasBernBurgdorf;
    //   bbox = [7.35, 46.85, 7.75, 47.15];
    // }

    if (bbox) {
      this.setBbox(bbox);
      this.mapCenterChange.pipe(take(1)).subscribe(() => {
          updateDataFunction();
          this.cd.detectChanges();
        }
      );
    }
  }

  // TODO: cdi ROKAS-453 get this to work in this separate dropdown
  // doesn't work:
  setAreaGeoJsonInput(event: Event): void {
    this.areas = {
      type: 'FeatureCollection',
      features: []
    };

    let bbox;

    if ((event.target as HTMLOptionElement).value === 'bern-burgdorf') {
      this.areas = this._areasBernBurgdorf; // change detection fails at this stage
      bbox = [7.35, 46.85, 7.75, 47.15];
    }

    if (bbox) {
      this.setBbox(bbox);
      this.mapCenterChange.pipe(take(1)).subscribe(() => {
        this.cd.detectChanges();
      });
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
    }
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
}
