import {Map as MaplibreMap, MapboxGeoJSONFeature} from 'maplibre-gl';
import {FeatureData, FeatureDataType} from '../../../journey-maps-client.interfaces';
import {Constants} from '../../constants';
import {MapRoutesService} from '@schweizerischebundesbahnen/journey-maps-client/src/lib/services/map/map-routes.service';

export class MapEventUtils {

  /* PUBLIC */

  static queryFeaturesByLayerIds(mapInstance: MaplibreMap, screenPoint: [number, number], layers: Map<string, FeatureDataType>): FeatureData[] {
    return mapInstance.queryRenderedFeatures(screenPoint, {
      layers: [...layers.keys()]
    }).map(f => this.toFeatureEventData(f, layers.get(f.layer.id)));
  }

  /**
   * Query feature in all visible layers in the layers list. Only features that are currently rendered are included.
   */
  static queryVisibleFeaturesByFilter(mapInstance: MaplibreMap, feature: FeatureData, layers: string[], filter?: any[]): FeatureData[] {
    return mapInstance.queryRenderedFeatures(null, {layers, filter})
      .map(f => this.toFeatureEventData(f, feature.featureDataType));
  }

  /**
   *  WARNING: in case of vector tiles (geOps source): this function does not check tiles outside the currently visible viewport.
   */
  static queryFeatureSourceByFilter(mapInstance: MaplibreMap, featureDataType: FeatureDataType, filter?: any[]): FeatureData[] {
    const sourceId = this.getSourceMapping(featureDataType);
    if (!sourceId) {
      throw new Error('Missing source mapping for feature type: ' + featureDataType);
    }
    return mapInstance.querySourceFeatures(sourceId, {filter})
      .map(f => {
        const data = this.toFeatureEventData(f, featureDataType);
        if (!data.source) {
          data.source = sourceId;
        }
        return data;
      });
  }

  static setFeatureState(mapFeature: MapboxGeoJSONFeature, mapInstance: MaplibreMap, state: any) {
    /* This part is important:
    - get fresh feature state instance from map source
    - override the input feature state -> keep in sync
    - Finally set the new state in map source.
    */
    if (!mapFeature.source) {
      throw new Error('Missing source id in feature: ' + mapFeature);
    }
    mapFeature.state = mapInstance.getFeatureState(mapFeature);
    mapFeature.state = Object.assign(mapFeature.state, state);
    mapInstance.setFeatureState(mapFeature, mapFeature.state);
  }

  static queryFeaturesByProperty(
    mapInstance: MaplibreMap,
    layers: Map<string, FeatureDataType>,
    propertyFilter: (value: MapboxGeoJSONFeature) => boolean
  ): FeatureData[] {
    return mapInstance.queryRenderedFeatures(null, {
      layers: [...layers.keys()]
    }).filter(propertyFilter).map(f => this.toFeatureEventData(f, layers.get(f.layer.id)));
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

  private static getSourceMapping(featureDataType: FeatureDataType): string {
    switch (featureDataType) {
      case FeatureDataType.MARKER:
        return Constants.MARKER_SOURCE;
      case FeatureDataType.ROUTE:
        return Constants.ROUTE_SOURCE;
      default:
        return undefined;
    }
  }
}
