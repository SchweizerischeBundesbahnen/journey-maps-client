import {Injectable} from '@angular/core';
import {Marker} from '../model/marker';
import {Feature} from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class MarkerConverterService {

  convertToFeature(marker: Marker): Feature {
    return {
      id: marker.id,
      geometry: {
        type: 'Point',
        coordinates: marker.position
      },
      type: 'Feature',
      properties: {...marker}
    };
  }
}
