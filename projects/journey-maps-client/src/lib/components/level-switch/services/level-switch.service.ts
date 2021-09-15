import {Injectable} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class LevelSwitchService {

  private map: mapboxgl.Map;

  constructor() {
  }

  setMap(map: mapboxgl.Map): void {
    this.map = map;
  }
}
