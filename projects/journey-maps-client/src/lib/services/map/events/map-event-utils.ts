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
      layers: [feature.layer.id],
      filter
    }).map(f => this.toFeatureEventData(f, feature.featureDataType));
  }

  static setFeatureState(mapFeature: MapboxGeoJSONFeature, mapInstance: MaplibreMap, state: any) {
    /* This part is important:
    - get fresh feature state insatance from map source
    - override the input feature state -> keep in sync
    - Finally set the new state in map source.
    */
    mapFeature.state = mapInstance.getFeatureState(mapFeature);
    mapFeature.state = Object.assign(mapFeature.state, state);
    mapInstance.setFeatureState(mapFeature, mapFeature.state);
  }

  /* private functions */
  private static toFeatureEventData(feature: MapboxGeoJSONFeature, featureDataType: FeatureDataType): FeatureData {
    return {
      featureDataType,
      // feature geometry is a getter function, so do map manually:
      geometry: feature.geometry,
      ...feature
    };
  }
}
