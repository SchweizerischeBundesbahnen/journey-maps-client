export interface FeatureLayerHeatmapRendererInfo {
  type: 'heatmap';

  /*heatmap*/
  blurRadius?: number,
  maxPixelIntensity?: number;
  minPixelIntensity?: number;
  colorStops?: { ratio: number; color: number[] }[];

  /**/
  [key: string]: any;
}
