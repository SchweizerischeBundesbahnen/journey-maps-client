import {Injectable} from '@angular/core';
import {CircleLayer, FillLayer, Layer, LineLayer} from 'maplibre-gl';
import {ArcgisSymbolDefinition} from '../model/arcgis-symbol-definition';
import {FeatureLayerUtilService} from './feature-layer-util.service';
import {FeatureLayerRendererInfo} from '../model/feature-layer-renderer-info';

@Injectable({
  providedIn: 'root'
})
export class FeatureLayerRendererSymbolParserService {

  constructor(private utilService: FeatureLayerUtilService) {
  }

  parseFeatureLayerRenderer(renderer: FeatureLayerRendererInfo): Layer {
    if (renderer.uniqueValueInfos) {
      const layer = this.createSimpleSymbolLayer(renderer.uniqueValueInfos[0].symbol);
      this.createUniqueColors(layer, renderer);
      return layer;
    }

    return this.createSimpleSymbolLayer(renderer.symbol);
  }

  private createSimpleSymbolLayer(symbol: ArcgisSymbolDefinition) {
    switch (symbol.type) {
      case 'esriSMS':
        // https://developers.arcgis.com/web-map-specification/objects/esriSMS_symbol/
        return this.createCircleLayer(symbol);
      case 'esriSLS':
        // https://developers.arcgis.com/web-map-specification/objects/esriSLS_symbol/
        return this.createLineLayer(symbol);
      case 'esriSFS':
        // https://developers.arcgis.com/web-map-specification/objects/esriSFS_symbol/
        return this.createFillLayer(symbol);
      case 'esriPMS':
      // https://developers.arcgis.com/web-map-specification/objects/esriPMS_symbol/
      case 'esriPFS':
      // https://developers.arcgis.com/web-map-specification/objects/esriPFS_symbol/
      case 'esriTS':
      // https://developers.arcgis.com/web-map-specification/objects/esriTS_symbol/
      default:
        throw new Error(`This symbol type is not supported: ${symbol.type}`);
    }
  }

  private createLineLayer(symbol: ArcgisSymbolDefinition): LineLayer {
    const lineLayer = {
      'id': '',
      'type': 'line',
      'paint': {
        'line-color': this.utilService.convertColorToRgba(symbol.color),
        'line-width': symbol.width
      }
    };

    if (symbol.style === 'esriSLSDot') {
      lineLayer['line-dasharray'] = [0.5, 1];
    } else if (symbol.style === 'esriSLSDash') {
      lineLayer['line-dasharray'] = [3, 3];
    }

    return lineLayer as LineLayer;
  }

  private createCircleLayer(symbol: ArcgisSymbolDefinition): CircleLayer {
    return {
      'id': '',
      'type': 'circle',
      'paint': {
        'circle-color': this.utilService.convertColorToRgba(symbol.color),
        'circle-radius': symbol.size,
        'circle-stroke-color': this.utilService.convertColorToRgba(symbol.outline.color),
        'circle-stroke-width': symbol.outline.width,
        'circle-translate': [symbol['xoffset'], symbol['yoffset']]
      }
    } as CircleLayer;
  }

  private createFillLayer(symbol: ArcgisSymbolDefinition): FillLayer {
    return {
      'id': '',
      'type': 'fill',
      'paint': {
        'fill-color': this.utilService.convertColorToRgba(symbol.color),
        'fill-outline-color': this.utilService.convertColorToRgba(symbol.outline.color),
      }
    } as FillLayer;
  }

  private createUniqueColors(layer: Layer, renderer: FeatureLayerRendererInfo): void {
    const paintColorDef = this.utilService.convertUniqueValueInfosToPaintColor(renderer);
    switch (layer.type) {
      case 'line':
        layer.paint['line-color'] = paintColorDef;
        break;
      case 'circle':
        layer.paint['circle-color'] = paintColorDef;
        const circleOutlineColorDef = this.utilService.convertUniqueValueInfosToPaintColor(renderer, true);
        layer.paint['circle-stroke-color'] = circleOutlineColorDef;
        break;
      case 'fill':
        layer.paint['fill-color'] = paintColorDef;
        const fillOutlineColorDef = this.utilService.convertUniqueValueInfosToPaintColor(renderer, true);
        layer.paint['fill-outline-color'] = fillOutlineColorDef;
        break;
      default:
        throw new Error(`Unique colors for layer type '${layer.type}' are not supported!`);
    }
  }
}
