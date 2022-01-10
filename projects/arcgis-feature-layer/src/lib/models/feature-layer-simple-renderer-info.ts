import {ArcgisSymbolDefinition} from './arcgis-symbol-definition';

export interface FeatureLayerSimpleRendererInfo {
  type: 'simple';

  /*simple*/
  symbol: ArcgisSymbolDefinition;

  /**/
  [key: string]: any;
}
