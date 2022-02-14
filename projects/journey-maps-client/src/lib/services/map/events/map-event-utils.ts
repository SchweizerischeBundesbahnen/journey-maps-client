import {Map as MaplibreMap, MapboxGeoJSONFeature, PointLike} from 'maplibre-gl';
import {FeatureData} from '../../../journey-maps-client.interfaces';

export class MapEventUtils {

  /* PUBLIC */
  static queryFeaturesByLayerIds(mapInstance: MaplibreMap, screenPoint: [number, number], layerIds: string[]): FeatureData[] {
    return mapInstance.queryRenderedFeatures(screenPoint, {layers: layerIds}).map(MapEventUtils.toFeatureEventData);
  }

  /* private functions */
  private static toFeatureEventData(feature: MapboxGeoJSONFeature): FeatureData {
    return {
      layerId: feature.layer.id,
      sourceId: feature.source,
      sourceLayerId: feature.sourceLayer,
      // feature geometry is a getter function, so do map manually:
      geometry: feature.geometry,
      ...feature
    };
  }
}
