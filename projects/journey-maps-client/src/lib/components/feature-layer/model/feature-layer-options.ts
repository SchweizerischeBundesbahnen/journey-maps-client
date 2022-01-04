export interface FeatureLayerOptions {
  url: string;
  requestWithCredentials?: boolean;
  featuresPerRequestLimit?: number;
  outFields?: string[];
  filter?: string;
  minZoom?: number;
  maxZoom?: number;
  style?: { type: string, paint: {} };
  addLayerBefore?: string;
}
