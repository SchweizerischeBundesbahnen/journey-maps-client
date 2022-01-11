export interface FeatureLayerOptions {
  id?: string;
  url: string;
  requestWithCredentials?: boolean;
  accessToken?: { [name: string]: string };
  featuresPerRequestLimit?: number;
  outFields?: string[];
  filter?: string;
  minZoom?: number;
  maxZoom?: number;
  style?: { type: string, paint: {} };
  addLayerBefore?: string;
}
