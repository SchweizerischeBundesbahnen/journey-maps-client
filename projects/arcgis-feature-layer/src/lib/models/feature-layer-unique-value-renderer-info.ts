import {ArcgisSymbolDefinition} from './arcgis-symbol-definition';

export interface FeatureLayerUniqueValueRendererInfo {
  type: 'uniqueValue';

  /*uniqueValue*/
  defaultSymbol?: ArcgisSymbolDefinition;
  uniqueValueInfos?: { symbol: ArcgisSymbolDefinition, value: any }[];
  field1?: string;

  /**/
  [key: string]: any;
}
