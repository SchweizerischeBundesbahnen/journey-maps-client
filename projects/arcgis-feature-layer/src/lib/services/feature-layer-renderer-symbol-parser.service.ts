import {Injectable} from '@angular/core';
import {CircleLayer, CirclePaint, FillLayer, FillPaint, HeatmapLayer, HeatmapPaint, Layer, LineLayer, LinePaint} from 'maplibre-gl';
import {ArcgisSymbolDefinition} from '../models/arcgis-symbol-definition';
import {FeatureLayerUtilService} from './feature-layer-util.service';
import {AnyFeatureLayerRendererInfo} from '../models/any-feature-layer-renderer-info';

/**
 * This service helps to parse the Arcgis specific feature layer definition and create a corresponding mapbox layer.
 */
@Injectable({
  providedIn: 'root'
})
export class FeatureLayerRendererSymbolParserService {

  constructor(private utilService: FeatureLayerUtilService) {
  }

  parseFeatureLayerRenderer(renderer: AnyFeatureLayerRendererInfo): Layer {
    if (renderer.uniqueValueInfos) {
      const layer = this.createSimpleSymbolLayer(renderer.uniqueValueInfos[0].symbol);
      this.createUniqueColors(layer, renderer);
      return layer;
    }
    if (renderer.colorStops) {
      return this.createHeatmapLayer(renderer.colorStops, renderer.blurRadius, renderer.maxPixelIntensity);
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
      } as LinePaint
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
      } as CirclePaint
    } as CircleLayer;
  }

  private createHeatmapLayer(colorStops: { ratio: number; color: number[] }[], heatmapRadius: number, heatmapIntensity: number): HeatmapLayer {
    const heatmapStops: any[] = ['interpolate', ['linear'], ['heatmap-density']];
    let duplicates = 0;
    colorStops.forEach(colorStop => {
      if (heatmapStops.some(def => def === colorStop.ratio)) {
        colorStop.ratio += ++duplicates * 0.00000000000000001;
      }
      heatmapStops.push(colorStop.ratio);
      heatmapStops.push(this.utilService.convertColorToRgba(colorStop.color));
    });

    return {
      'id': '',
      'type': 'heatmap',
      'paint': {
        'heatmap-color': heatmapStops,
        'heatmap-radius': heatmapRadius + 20 // looks like in arcgis
        // 'heatmap-intensity': heatmapIntensity, looks not good - leave default
      } as HeatmapPaint
    } as HeatmapLayer;
  }

  private createFillLayer(symbol: ArcgisSymbolDefinition): FillLayer {
    return {
      'id': '',
      'type': 'fill',
      'paint': {
        'fill-color': this.utilService.convertColorToRgba(symbol.color),
        'fill-outline-color': this.utilService.convertColorToRgba(symbol.outline.color),
      } as FillPaint
    } as FillLayer;
  }

  private createUniqueColors(layer: Layer, renderer: AnyFeatureLayerRendererInfo): void {
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
