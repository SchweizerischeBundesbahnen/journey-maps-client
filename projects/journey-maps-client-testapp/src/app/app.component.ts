import {Component} from '@angular/core';
import {Marker} from '../../../journey-maps-client/src/lib/model/marker';
import {MarkerCategory} from '../../../journey-maps-client/src/lib/model/marker-category.enum';
import {TextInfoBlock} from '../../../journey-maps-client/src/lib/model/infoblock/text-info-block';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'journey-maps-client-testapp';
  markers: Marker[] = [
    {
      id: 'home',
      title: 'Home Office',
      subtitle: 'My home is my castle',
      position: [7.296515, 47.069815],
      category: MarkerCategory.INFORMATION,
      infoBlocks: [
        {
          title: 'Lorem Ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipisici elit.'
        } as TextInfoBlock
      ]
    },
    {
      id: 'playground',
      title: 'Playground',
      subtitle: 'Sun, fun and nothing to do',
      position: [7.299265, 47.072120],
      category: MarkerCategory.INFORMATION
    },
    {
      id: 'work',
      title: 'Office',
      subtitle: 'SBB Wylerpark',
      position: [7.446450, 46.961409],
      category: MarkerCategory.WARNING
    },
  ];
}
