import {Injectable} from '@angular/core';
import {Geometry, Point} from 'geojson';
import {FlyToOptions, LngLat, LngLatBoundsLike, LngLatLike, Map as MapboxMap} from 'mapbox-gl';
import {Constants} from '../constants';

@Injectable({providedIn: 'root'})
export class MapService {

  readonly emptyFeatureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  constructor() {
  }

  moveMap(map: MapboxMap, center: LngLatLike, zoomLevel: number, boundingBox: LngLatBoundsLike, boundingBoxPadding: number): void {
    if (zoomLevel || center) {
      this.centerMap(map, center, zoomLevel);
    } else if (boundingBox) {
      map.fitBounds(boundingBox, {padding: boundingBoxPadding});
    }
  }

  convertToLngLatLike(geometry: Geometry): LngLatLike {
    return (geometry as Point).coordinates as LngLatLike;
  }

  addMissingImage(map: mapboxgl.Map, name: string, icon: string): void {
    map.loadImage(icon, (error, image) => this.imageLoadedCallback(map, name, error, image));
  }

  verifySources(map: MapboxMap): void {
    for (const id of Constants.SOURCES) {
      const source = map.getSource(id);
      if (!source) {
        throw new Error(`${source} was not found in map definition!`);
      }
    }
  }

  private imageLoadedCallback(map: mapboxgl.Map, name: string, error: any, image: any): void {
    if (error) {
      console.error(error);
    } else {
      map.addImage(name, image, {pixelRatio: 2});
    }
  }

  private centerMap(map: MapboxMap, center: LngLatLike, zoomLevel: number): void {
    const options: FlyToOptions = {};
    if (zoomLevel && map.getZoom() !== zoomLevel) {
      options.zoom = zoomLevel;
    }
    if (center) {
      const oldCenter = map.getCenter();
      const newCenter = LngLat.convert(center);
      const distance = oldCenter.distanceTo(newCenter);
      if (distance > 1) {
        options.center = newCenter;
      }
    }
    if (Object.keys(options).length) {
      map.flyTo(options);
    }
  }
}
