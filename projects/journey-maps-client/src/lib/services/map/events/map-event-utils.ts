import {Map as MaplibreMap, MapboxGeoJSONFeature} from 'maplibre-gl';
import {FeatureData, FeatureDataType} from '../../../journey-maps-client.interfaces';

export class MapEventUtils {

  /* PUBLIC */
  static queryFeaturesByLayerIds(mapInstance: MaplibreMap, screenPoint: [number, number], layers: Map<string, FeatureDataType>): FeatureData[] {
    return mapInstance.queryRenderedFeatures(screenPoint, {
      layers: [...layers.keys()]
    }).map(f => this.toFeatureEventData(f, layers.get(f.layer.id)));
  }

  static queryFeaturesByFilter(mapInstance: MaplibreMap, feature: FeatureData, filter?: any[]): FeatureData[] {
    return mapInstance.queryRenderedFeatures(null, {
      layers: [feature.layerId],
      filter
    }).map(f => this.toFeatureEventData(f, feature.featureDataType));
  }

  /* private functions */
  private static toFeatureEventData(feature: MapboxGeoJSONFeature, featureDataType: FeatureDataType): FeatureData {
    return {
      featureDataType,
      layerId: feature.layer.id,
      sourceId: feature.source,
      sourceLayerId: feature.sourceLayer,
      // feature geometry is a getter function, so do map manually:
      geometry: feature.geometry,
      ...feature
    };
  }
}
