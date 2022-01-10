import {Injectable} from '@angular/core';
import {AnyFeatureLayerRendererInfo} from '../models/any-feature-layer-renderer-info';

@Injectable({
  providedIn: 'root'
})
export class FeatureLayerUtilService {

  convertUniqueValueInfosToPaintColor(renderer: AnyFeatureLayerRendererInfo, byOutlineColor?: boolean) {
    const invisibleColor = [0, 0, 0, 0];
    const fallbackValue = 0;

    const featurePropertyName = renderer.field1;
    const uniqueValueInfos = renderer.uniqueValueInfos;
    const defaultSymbolColor = renderer.defaultSymbol?.color;
    const fallbackColor = this.convertColorToRgba(defaultSymbolColor ?? invisibleColor);

    const valueMapping: any[] = ['match', ['get', featurePropertyName]];

    const uniqueValueColorMapping: any[] = ['interpolate', ['linear'], valueMapping, fallbackValue, fallbackColor];
    uniqueValueInfos.forEach((info, idx) => {
      const colorDef = {
        id: idx + 1,
        value: info['value'],
        color: this.convertColorToRgba(byOutlineColor ? info['symbol']['outline']['color'] : info['symbol']['color'])
      };
      valueMapping.push(colorDef.value);
      valueMapping.push(colorDef.id);
      uniqueValueColorMapping.push(colorDef.id);
      uniqueValueColorMapping.push(colorDef.color);
    });

    // fallback (default) value:
    valueMapping.push(fallbackValue);

    return uniqueValueColorMapping;
  }

  convertColorToRgba(color: number[]): string | undefined {
    if (!color || !color.length) {
      return;
    }
    const rgb = color.slice(0, 3).join();
    const alpha = (color.slice(-1)[0] / 255.0).toFixed(2);
    return `rgba(${rgb},${alpha})`;
  }

  convertScaleToLevel(scale: number): number {
    if (scale === 0) {
      return 0;
    }

    // TODO: not sure if this is ok:
    const lower = this.arcgisLODs.find(lod => lod.scale < scale);
    return (lower.level - 1) + (scale / (lower.scale * 2));
  }

  private readonly arcgisLODs = [
    {'level': 0, 'scale': 5.91657527591555E8}, {
      'level': 1, 'scale': 2.95828763795777E8
    }, {'level': 2, 'scale': 1.47914381897889E8}, {
      'level': 3, 'scale': 7.3957190948944E7
    }, {'level': 4, 'scale': 3.6978595474472E7}, {
      'level': 5, 'scale': 1.8489297737236E7
    }, {'level': 6, 'scale': 9244648.868618}, {
      'level': 7, 'scale': 4622324.434309
    }, {'level': 8, 'scale': 2311162.217155}, {
      'level': 9, 'scale': 1155581.108577
    }, {'level': 10, 'scale': 577790.554289}, {
      'level': 11, 'scale': 288895.277144
    }, {'level': 12, 'scale': 144447.638572}, {
      'level': 13, 'scale': 72223.819286
    }, {'level': 14, 'scale': 36111.909643}, {
      'level': 15, 'scale': 18055.954822
    }, {'level': 16, 'scale': 9027.977411}, {
      'level': 17, 'scale': 4513.988705
    }, {'level': 18, 'scale': 2256.994353}, {
      'level': 19, 'scale': 1128.497176
    }, {'level': 20, 'scale': 564.248588}, {
      'level': 21, 'scale': 282.124294
    }, {'level': 22, 'scale': 141.062147}, {
      'level': 23, 'scale': 70.5310735
    }, {'level': 24, 'scale': 0}
  ];
}
