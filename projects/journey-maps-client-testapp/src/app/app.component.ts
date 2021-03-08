import {Component, OnInit, ViewChild} from '@angular/core';
import {Marker} from '../../../journey-maps-client/src/lib/model/marker';
import {MarkerCategory} from '../../../journey-maps-client/src/lib/model/marker-category.enum';
import {InfoBlockFactoryService} from '../../../journey-maps-client/src/lib/services/info-block-factory.service';
import {LngLatBoundsLike, LngLatLike} from 'mapbox-gl';
import {LoremIpsum} from 'lorem-ipsum';
import {JourneyMapsClientComponent} from '../../../journey-maps-client/src/lib/journey-maps-client.component';
import {AssetReaderService} from './services/asset-reader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private infoBlockFactoryService: InfoBlockFactoryService,
              private assetReaderService: AssetReaderService) {
  }

  title = 'journey-maps-client-testapp';
  loremIpsum = new LoremIpsum();

  @ViewChild(JourneyMapsClientComponent) rokasClient: JourneyMapsClientComponent;

  // Initial map position
  zoomLevel = 7.5;
  mapCenter: LngLatLike = [7.4391326448171196, 46.948834547463086];
  selectedMarkerId: string;

  // Can be used instead of zoomLevel and mapCenter
  boundingBox: LngLatBoundsLike = [[-9.97708574059, 51.6693012559], [-6.03298539878, 55.1316222195]];

  // Can be used instead of zoomLevel and mapCenter
  zoomToMarkers = true;

  // Call this.rokasClient.updateMarkers() when markers have been added/removed.
  markers: Marker[] = [
    {
      id: 'velo',
      title: 'Basel - Bahnhof SBB',
      subtitle: 'Rent a Bike - Ihr Mietvelo',
      position: [7.5897, 47.5476],
      category: MarkerCategory.INFORMATION,
      infoBlocks: [
        this.infoBlockFactoryService.createTextInfoBlock(
          'Verfügbare Velotypen',
          'Komfortvelo, Countrybikes, Mountainbikes, E-Bikes City, Tandem, E-Bikes Mountain, Kindervelos, Kindertrailer, Kinderanhänger'
        ),
        this.infoBlockFactoryService.createTextInfoBlock(
          'Rückgabe',
          'An allen Mietstationen von Rent a Bike'
        ),
        // TODO : DKU ContactInfoBlock
        this.infoBlockFactoryService.createHtmlInfoBlock(
          'Kontakt', // TODO : DKU Translations
          'Centralbahnstrasse 20<br>4051 Basel <br><a href="tel:+41 (0)61 272 09 10">+41 (0)61 272 09 10</a><br><a href="mailto:veloparking@iss.ch">veloparking@iss.ch</a>'
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
      category: MarkerCategory.INFORMATION,
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
      category: MarkerCategory.INFORMATION,
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
      infoBlocks: [/* no teaser/overlay will be shown unless infoBoxTemplate is defined on the component */]
    },
    {
      id: 'work',
      title: 'Office',
      subtitle: 'SBB Wylerpark',
      position: [7.446450, 46.961409],
      category: MarkerCategory.WARNING,
      infoBlocks: [
        this.infoBlockFactoryService.createButtonInfoBlock(
          'Show menu plan',
          'https://zfv.ch/en/microsites/sbb-restaurant-wylerpark/menu-plan'
        )
      ]
    },
  ];

  journeyGeoJson: string;

  ngOnInit(): void {
    this.assetReaderService.loadAssetAsString('journey/zh-bielmett.json')
      .subscribe(txt => this.journeyGeoJson = txt);
  }

  setSelecteMarkerId(selectedMarkerId: string): void {
    this.selectedMarkerId = selectedMarkerId;
  }
}
