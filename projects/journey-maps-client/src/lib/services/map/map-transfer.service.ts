import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource} from 'mapbox-gl';

@Injectable({providedIn: 'root'})
export class MapTransferService {

  constructor() {
  }

  updateTransfer(map: mapboxgl.Map, featureCollection: GeoJSON.FeatureCollection): void {
    const source = map.getSource(Constants.WALK_SOURCE) as GeoJSONSource;
    source.setData(featureCollection);
  }
}
