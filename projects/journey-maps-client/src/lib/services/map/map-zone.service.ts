import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource, Map as MaplibreMap} from 'maplibre-gl';
import {MapService} from './map.service';

@Injectable({providedIn: 'root'})
export class MapZoneService {

  static allZoneLayers: string[] = [
    'rokas-zone',
    'rokas-zone-outline',
    'rokas-zone-label',
  ];

  constructor(private mapService: MapService) {
  }

  updateZones(map: MaplibreMap, zonesFeatureCollection: GeoJSON.FeatureCollection = this.mapService.emptyFeatureCollection): void {
    const source = map.getSource(Constants.ZONE_SOURCE) as GeoJSONSource;
    source.setData(zonesFeatureCollection);
  }
}
