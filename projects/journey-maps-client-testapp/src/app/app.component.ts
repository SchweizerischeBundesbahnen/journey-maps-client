import {Component} from '@angular/core';
import {Marker} from '../../../journey-maps-client/src/lib/model/marker';
import {MarkerCategory} from '../../../journey-maps-client/src/lib/model/marker-category.enum';
import {InfoBlockFactoryService} from '../../../journey-maps-client/src/lib/services/info-block-factory.service';
import {LngLatLike} from 'mapbox-gl';
import {LoremIpsum} from 'lorem-ipsum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private infoBlockFactoryService: InfoBlockFactoryService) {
  }

  title = 'journey-maps-client-testapp';
  loremIpsum = new LoremIpsum();

  zoomLevel = 7.5;
  mapCenter: LngLatLike = [7.4391326448171196, 46.948834547463086];

  markers: Marker[] = [
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
      id: 'playground',
      title: 'Playground',
      subtitle: 'Sun, fun and nothing to do',
      position: [7.299265, 47.072120],
      category: MarkerCategory.INFORMATION,
      infoBlocks: [
        this.infoBlockFactoryService.createHtmlInfoBlock(
          'Cupcake Ipsum',
          `<ul style="margin-top: 0">
                    <li style="margin-top: 0; color: green">Donut fruitcake</li>
                    <li style="margin-top: 0; color: deeppink">Cotton Candy</li>
                    <li style="margin-top: 0; color: orange">Tart jelly</li>
                </ul>`
        )
      ]
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
}
