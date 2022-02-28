import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource, Map as MaplibreMap, MapboxGeoJSONFeature} from 'maplibre-gl';
import {EMPTY_FEATURE_COLLECTION} from './map.service';
import {
  MapEventUtilsService,
} from '@schweizerischebundesbahnen/journey-maps-client/src/lib/services/map/events/map-event-utils.service';
import {GeoJSON} from 'geojson';

export const SELECTED_PROPERTY_NAME = 'isSelected';

@Injectable({providedIn: 'root'})
export class MapZoneService {

  static allZoneLayers: string[] = [
    'rokas-zone',
    'rokas-zone-outline',
    'rokas-zone-label',
  ];

  constructor(private mapEventUtils: MapEventUtilsService) {}

  updateZones(map: MaplibreMap, zonesFeatureCollection: GeoJSON.FeatureCollection = EMPTY_FEATURE_COLLECTION): void {
    if (!zonesFeatureCollection.features?.length) {
      return;
    }

    // set IDs here to prevent mapbox from generating its own IDs in source.setData()
    zonesFeatureCollection.features.forEach((feature, idx) => {
      feature.id = idx + 1;
    });

    const source = map.getSource(Constants.ZONE_SOURCE) as GeoJSONSource;
    source.setData(zonesFeatureCollection);

    map.once('idle', () => {
      zonesFeatureCollection.features.forEach(feature => {
        if (feature.properties[SELECTED_PROPERTY_NAME]) {
          const mapboxFeature = {
            ...feature,
            geometry: feature.geometry,
            source: Constants.ZONE_SOURCE,
          } as unknown as MapboxGeoJSONFeature;
          this.mapEventUtils.setFeatureState(mapboxFeature, map, {selected: true});
        }
      });
    });
  }
}
