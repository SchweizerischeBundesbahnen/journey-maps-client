import {Component, OnDestroy, OnInit} from '@angular/core';
import {Marker} from '../../../journey-maps-client/src/lib/model/marker';
import {MarkerCategory} from '../../../journey-maps-client/src/lib/model/marker-category.enum';
import {InfoBlockFactoryService} from '../../../journey-maps-client/src/lib/services/info-block-factory.service';
import {LngLatLike, Map} from 'mapbox-gl';
import {LoremIpsum} from 'lorem-ipsum';
import {AssetReaderService} from './services/asset-reader.service';
import {MarkerColor} from '../../../journey-maps-client/src/lib/model/marker-color.enum';
import {Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {StyleMode} from '../../../journey-maps-client/src/lib/model/style-mode.enum';
import {
  MovementControls,
  InitialSettings,
  JourneyMapsGeoJsonOption,
  Styles,
} from '../../../journey-maps-client/src/lib/journey-maps-client.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private infoBlockFactoryService: InfoBlockFactoryService,
    private assetReaderService: AssetReaderService
  ) {
  }

  private loremIpsum = new LoremIpsum();
  private _journey: GeoJSON.FeatureCollection;
  private _transferLuzern: GeoJSON.FeatureCollection;
  private _transferZurichIndoor: GeoJSON.FeatureCollection;
  private _transferBernIndoor: GeoJSON.FeatureCollection;
  private _transferGeneveIndoor: GeoJSON.FeatureCollection;
  private _routes: GeoJSON.FeatureCollection[] = [];
  private destroyed = new Subject<void>();

  movementControls: MovementControls = {
    showLevelSwitch: true,
    showZoomControls: true,
    allowOneFingerPan: true,
    allowScrollZoom: true,
  };
  selectedMarkerId: string;
  visibleLevels: number[];
  selectedLevel: number;
  initialSettings: InitialSettings = {
    boundingBox: [[6.02260949059, 45.7769477403], [10.4427014502, 47.8308275417]],
  };
  popup = true;
  styles: Styles = {};

  journeyMapsGeoJsonOptions = ['journey', 'transfer luzern', 'transfer zurich', 'transfer bern', 'transfer geneve', 'routes'];
  journeyMapsGeoJson: JourneyMapsGeoJsonOption;

  zoomLevel: number;
  minZoomLevel: number;
  maxZoomLevel: number;
  zoomLevelChanged = new Subject<number>();
  mapCenter: LngLatLike;
  mapCenterChanged = new Subject<LngLatLike>();
  map: Map;

  markers: Marker[] = [
    {
      id: 'velo',
      title: 'Basel - Bahnhof SBB',
      subtitle: 'Rent a Bike - Ihr Mietvelo',
      position: [7.5897, 47.5476],
      category: MarkerCategory.BICYCLEPARKING,
      color: MarkerColor.BLACK,
      infoBlocks: [
        this.infoBlockFactoryService.createTextInfoBlock(
          'Verfügbare Velotypen',
          'Komfortvelo, Countrybikes, Mountainbikes, E-Bikes City, Tandem, E-Bikes Mountain, Kindervelos, Kindertrailer, Kinderanhänger'
        ),
        this.infoBlockFactoryService.createTextInfoBlock(
          'Rückgabe',
          'An allen Mietstationen von Rent a Bike.'
        ),
        this.infoBlockFactoryService.createAddressInfoBlock(
          'Kontakt',
          'Centralbahnstrasse 20',
          '4051',
          'Basel',
          'veloparking@iss.ch',
          '+41 (0)61 272 09 10',
        ),
        this.infoBlockFactoryService.createButtonInfoBlock(
          'Zur Velostation',
          'https://www.rentabike.ch/stationen?c=152'
        )
      ]
    },
    {
      id: 'home',
      title: 'Home Office',
      subtitle: 'My home is my castle',
      position: [7.296515, 47.069815],
      category: MarkerCategory.WARNING,
      color: MarkerColor.RED,
      infoBlocks: [
        this.infoBlockFactoryService.createTextInfoBlock(
          this.loremIpsum.generateWords(3),
          this.loremIpsum.generateSentences(2),
          'blueText'
        ),
        this.infoBlockFactoryService.createTextInfoBlock(
          this.loremIpsum.generateWords(3),
          this.loremIpsum.generateParagraphs(3)
        )
      ]
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
      infoBlocks: [/* no teaser/overlay will be shown unless markerDetailsTemplate is defined on the component */]
    },
    {
      id: 'work',
      title: 'Office',
      subtitle: 'SBB Wylerpark',
      position: [7.446450, 46.961409],
      category: MarkerCategory.RAIL,
      color: MarkerColor.DARKBLUE,
      infoBlocks: [
        this.infoBlockFactoryService.createButtonInfoBlock(
          'Show menu plan',
          'https://zfv.ch/en/microsites/sbb-restaurant-wylerpark/menu-plan'
        )
      ]
    },
  ];

  customButtonStyle = 'background-color: white; border-width: 1px; border-radius: 5px; margin: 5px 5px 0 0;';

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

    this.zoomLevelChanged.pipe(takeUntil(this.destroyed)).subscribe(_zoomLevel => this.zoomLevel = _zoomLevel);
    this.mapCenterChanged.pipe(takeUntil(this.destroyed)).subscribe(_mapCenter => this.mapCenter = _mapCenter);
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
    this.journeyMapsGeoJson = {};

    let bbox;
    let updateDataFunction: () => void;
    if ((event.target as HTMLOptionElement).value === 'journey') {
      updateDataFunction = () => this.journeyMapsGeoJson = {journey: this._journey};
      bbox = this._journey.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer luzern') {
      updateDataFunction = () => this.journeyMapsGeoJson = {transfer: this._transferLuzern};
      bbox = this._transferLuzern.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer zurich') {
      updateDataFunction = () => this.journeyMapsGeoJson = {transfer: this._transferZurichIndoor};
      bbox = this._transferZurichIndoor.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer bern') {
      updateDataFunction = () => this.journeyMapsGeoJson = {transfer: this._transferBernIndoor};
      bbox = this._transferBernIndoor.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'transfer geneve') {
      updateDataFunction = () => this.journeyMapsGeoJson = {transfer: this._transferGeneveIndoor};
      bbox = this._transferGeneveIndoor.bbox;
    }
    if ((event.target as HTMLOptionElement).value === 'routes') {
      this.journeyMapsGeoJson = {routes: this._routes};
    }

    if (bbox) {
      this.setBbox(bbox);
      this.mapCenterChanged.pipe(take(1)).subscribe(() => updateDataFunction());
    }
  }

  setPopupInput(event: Event): void {
    this.selectedMarkerId = undefined;
    this.popup = (event.target as HTMLOptionElement).value === 'true';
  }

  setStyleModeInput(event: Event): void {
    this.selectedMarkerId = undefined;
    // replace the entire object to fire change detection
    this.styles = {
      ...this.styles,
      mode: StyleMode[(event.target as HTMLOptionElement).value],
    };
  }

  zoomIn(): void {
    this.map.zoomIn();
  }

  zoomOut(): void {
    this.map.zoomOut();
  }

  private setBbox(bbox: number[]): void {
    this.initialSettings = {
      ...this.initialSettings,
      boundingBox: [[bbox[0], bbox[1]], [bbox[2], bbox[3]]],
    };
  }
}
