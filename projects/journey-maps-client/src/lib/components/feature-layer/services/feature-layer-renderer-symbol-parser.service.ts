import {Injectable} from '@angular/core';
import {Layer} from 'maplibre-gl';

@Injectable({
  providedIn: 'root'
})
export class FeatureLayerRendererSymbolParserService {

  constructor() {
  }

  parseArcgisSymbol(symbol: string): Layer {
    switch (symbol['type']) {
      case 'esriSMS':

        const color = symbol['color'].slice(0, 3).join();
        const opacity = symbol['color'].slice(-1) / 255.0;
        const outlineColor = symbol['outline']['color'].slice(0, 3).join();
        const outlineOpacity = symbol['outline']['color'].slice(-1) / 255.0;

        return {
          'id': '',
          'type': 'circle',
          'paint': {
            'circle-color': `rgb(${color})`,
            'circle-opacity': opacity,
            'circle-radius': symbol['size'],
            'circle-stroke-color': `rgb(${outlineColor})`,
            'circle-stroke-width': symbol['outline']['width'],
            'circle-stroke-opacity': outlineOpacity,
            'circle-translate': [symbol['xoffset'], symbol['yoffset']]
          }
        };
      case 'esriSLS':
      case 'esriSFS':
      case 'esriPMS':
      case 'esriPFS':
      default:
        throw new Error(`This symbol type is not supported: ${symbol}`);
    }
  }
}
