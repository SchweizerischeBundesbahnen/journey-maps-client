import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource, Map as MaplibreMap} from 'maplibre-gl';
import {MapService} from './map.service';

@Injectable({providedIn: 'root'})
export class MapAreaService {

  constructor(private mapService: MapService) {
  }

  updateAreas(map: MaplibreMap, areasFeatureCollection: GeoJSON.FeatureCollection = this.mapService.emptyFeatureCollection): void {
    const source = map.getSource(Constants.AREA_SOURCE) as GeoJSONSource;
    source.setData(areasFeatureCollection);
  }
}
