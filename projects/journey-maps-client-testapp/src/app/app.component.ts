import {Component} from '@angular/core';
import {Marker} from '../../../journey-maps-client/src/lib/model/marker';
import {MarkerCategory} from '../../../journey-maps-client/src/lib/model/marker-category.enum';
import {InfoBlockFactoryService} from '../../../journey-maps-client/src/lib/services/info-block-factory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private infoBlockFactoryService: InfoBlockFactoryService) {
  }

  title = 'journey-maps-client-testapp';
  markers: Marker[] = [
    {
      id: 'home',
      title: 'Home Office',
      subtitle: 'My home is my castle',
      position: [7.296515, 47.069815],
      category: MarkerCategory.INFORMATION,
      infoBlocks: [
        this.infoBlockFactoryService.createTextInfoBlock(
          'Bavaria ipsum',
          'Bavaria ipsum dolor sit amet Resi vui huift vui baddscher obandln'
        ),
        this.infoBlockFactoryService.createTextInfoBlock(
          'Lorem Ipsum',
          'Lorem ipsum dolor sit amet, consectetur adipisici elit',
          'blueText'
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
