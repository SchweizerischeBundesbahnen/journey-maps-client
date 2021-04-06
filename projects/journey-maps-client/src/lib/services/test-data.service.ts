import {Injectable} from '@angular/core';
import {TextInfoBlock} from '../model/infoblock/text-info-block';
import {ButtonInfoBlock} from '../model/infoblock/button-info-block';
import {Marker} from '../model/marker';

@Injectable({
  providedIn: 'root'
})
export class TestDataService {

  constructor() {
  }

  createMarkerWithoutInfoBlocks(): Marker {
    return {
      id: 'work',
      title: 'Office',
      position: [7.446450, 46.961409],
      category: 'WARNING',
    };
  }

  createMarkerWithInfoBlocks(): Marker {
    return {
      ...this.createMarkerWithoutInfoBlocks(),
      infoBlocks: [
        {
          type: 'TEXT',
          title: 'Lorem Ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipisici elit',
        } as TextInfoBlock,
        {
          type: 'BUTTON',
          title: 'Bavaria Ipsum',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        } as ButtonInfoBlock,
      ],
    };
  }
}
