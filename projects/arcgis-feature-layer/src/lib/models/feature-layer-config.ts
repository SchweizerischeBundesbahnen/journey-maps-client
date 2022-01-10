import {FeatureLayerRendererInfo} from './feature-layer-renderer-info';

export interface FeatureLayerConfig {
  minScale: number;
  maxScale: number;
  maxRecordCount: number;
  displayField?: string;
  drawingInfo: { renderer: FeatureLayerRendererInfo };
  transparency: number;
}
