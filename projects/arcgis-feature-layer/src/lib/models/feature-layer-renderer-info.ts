import {ArcgisSymbolDefinition} from './arcgis-symbol-definition';

export interface FeatureLayerRendererInfo {
  type: 'simple' | 'uniqueValue' | 'heatmap';

  /*simple*/
  symbol: ArcgisSymbolDefinition;

  /*uniqueValue*/
  defaultSymbol?: ArcgisSymbolDefinition;
  uniqueValueInfos?: { symbol: ArcgisSymbolDefinition, value: any }[];
  field1?: string;

  /*heatmap*/
  blurRadius?: number,
  maxPixelIntensity?: number;
  minPixelIntensity?: number;
  colorStops?: { ratio: number; color: number[] }[];

  /**/
  [key: string]: any;
}
