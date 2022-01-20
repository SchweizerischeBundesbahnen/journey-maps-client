import {AnyFeatureLayerRendererInfo} from './any-feature-layer-renderer-info';

export interface FeatureLayerConfig {
  minScale: number;
  maxScale: number;
  maxRecordCount: number;
  displayField?: string;
  drawingInfo: { renderer: AnyFeatureLayerRendererInfo };
  transparency: number;
}

