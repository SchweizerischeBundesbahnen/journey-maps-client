import {FeatureLayerSimpleRendererInfo} from './feature-layer-simple-renderer-info';
import {FeatureLayerUniqueValueRendererInfo} from './feature-layer-unique-value-renderer-info';
import {FeatureLayerHeatmapRendererInfo} from './feature-layer-heatmap-renderer-info';

export type AnyFeatureLayerRendererInfo =
  | FeatureLayerSimpleRendererInfo
  | FeatureLayerUniqueValueRendererInfo
  | FeatureLayerHeatmapRendererInfo
