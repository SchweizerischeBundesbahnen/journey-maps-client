import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource} from 'mapbox-gl';
import {MapService} from './map.service';

@Injectable({providedIn: 'root'})
export class MapTransferService {

  constructor(private mapService: MapService) {
  }


  updateTransferRaw(map: mapboxgl.Map, transferGeoJSON: GeoJSON.FeatureCollection): void {
    if (!transferGeoJSON) {
      return;
    }

    this.updateTransfer(map, transferGeoJSON);
  }

  updateTransfer(map: mapboxgl.Map, featureCollection: GeoJSON.FeatureCollection = this.mapService.emptyFeatureCollection): void {
    const source = map.getSource(Constants.WALK_SOURCE) as GeoJSONSource;
    source.setData(featureCollection);
  }
}
