import {Map as MaplibreMap, MapboxGeoJSONFeature} from 'maplibre-gl';
import {FeatureEventData} from '../../../journey-maps-client.interfaces';

export class MapEventUtils {

  /* PUBLIC */
  static queryFeaturesByLayerIds(mapInstance: MaplibreMap, screenPoint: [number, number], layerIds: string[]): FeatureEventData[] {
    return mapInstance.queryRenderedFeatures(screenPoint, {layers: layerIds}).map(MapEventUtils.toFeatureEventData);
  }

  /* private functions */
  private static toFeatureEventData(feature: MapboxGeoJSONFeature): FeatureEventData {
    return {
      layerId: feature.layer.id,
      sourceId: feature.source,
      sourceLayerId: feature.sourceLayer,
      feature: {
        // CHECKME ses: Warum wird 'geometry' nicht automatisch gemappt?
        geometry: feature.geometry,
        ...feature
      }
    };
  }
}
