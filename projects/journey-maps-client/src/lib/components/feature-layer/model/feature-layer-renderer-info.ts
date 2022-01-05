import {ArcgisSymbolDefinition} from './arcgis-symbol-definition';

export interface FeatureLayerRendererInfo {
  symbol: ArcgisSymbolDefinition;
  defaultSymbol?: ArcgisSymbolDefinition;
  uniqueValueInfos?: { symbol: ArcgisSymbolDefinition, value: any }[];
  field1?: string;
  type: 'simple' | 'uniqueValue';

  [key: string]: any;
}
