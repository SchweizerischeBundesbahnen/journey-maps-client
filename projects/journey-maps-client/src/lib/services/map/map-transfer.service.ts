import {Injectable} from '@angular/core';
import {Constants} from '../constants';
import {GeoJSONSource} from 'maplibre-gl';
import {MapService} from './map.service';

@Injectable({providedIn: 'root'})
export class MapTransferService {

  private data: GeoJSON.FeatureCollection;

  constructor(private mapService: MapService) {
  }

  updateTransfer(map: maplibregl.Map, featureCollection: GeoJSON.FeatureCollection = this.mapService.emptyFeatureCollection): void {
    this.getSource(map).setData(featureCollection);
    this.data = featureCollection;
  }

  // If we enter the station on another floor than '0' then the outdoor route should be displayed
  // on two floors. (Floor 0 and 'entrance' floor)
  updateOutdoorWalkFloor(map: maplibregl.Map, level: number): void {
    let floorChanged = false;

    (this.data?.features ?? [])
      .filter(f => +f.properties.additionalFloor === level)
      .forEach(f => {
        const floor = f.properties.floor;
        f.properties.floor = f.properties.additionalFloor;
        f.properties.additionalFloor = floor;
        floorChanged = true;
      });

    if (floorChanged) {
      this.getSource(map).setData(this.data);
    }
  }

  private getSource(map: maplibregl.Map): GeoJSONSource {
    return map.getSource(Constants.WALK_SOURCE) as GeoJSONSource;
  }
}
