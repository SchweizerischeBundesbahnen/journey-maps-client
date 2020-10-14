import {Injectable} from '@angular/core';
import {FlyToOptions, GeoJSONSource, LngLat, LngLatLike, Map as MapboxMap, MapboxGeoJSONFeature} from 'mapbox-gl';
import {Constants} from './constants';
import {Marker} from '../model/marker';
import {MarkerConverterService} from './marker-converter.service';
import {Geometry, Point} from 'geojson';
import {MarkerCategory} from '../model/marker-category.enum';


@Injectable({
  providedIn: 'root'
})
export class MapService {

  readonly emptyFeatureCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: []
  };

  constructor(private markerConverter: MarkerConverterService) {
  }

  onMapLoaded(map: MapboxMap): void {
    this.verifySources(map);

    map.resize();

    const markerSource = this.getMarkerSource(map);
    markerSource.setData(this.emptyFeatureCollection);
  }

  private verifySources(map: MapboxMap): void {
    const markerSource = this.getMarkerSource(map);
    if (!markerSource) {
      throw new Error(`${Constants.MARKER_SOURCE} was not found in map definition!`);
    }
  }

  updateMarkers(map: MapboxMap, markers: Marker[]): void {
    this.verifyMarkers(markers);
    this.unselectFeature(map);
    this.addMissingImages(map, markers);

    const markerSource = this.getMarkerSource(map);

    let features;
    if (markers == null || markers.length === 0) {
      features = [];
    } else {
      features = markers.map(this.markerConverter.convertToFeature);
    }

    const newData = {...this.emptyFeatureCollection};
    newData.features = features;
    markerSource.setData(newData);

    return undefined; // => No Feature is currently selected
  }

  private getMarkerSource(map: MapboxMap): GeoJSONSource {
    return map.getSource(Constants.MARKER_SOURCE) as GeoJSONSource;
  }

  onClusterClicked(map: MapboxMap, feature: MapboxGeoJSONFeature): void {
    this.getMarkerSource(map).getClusterExpansionZoom(
      feature.properties.cluster_id,
      (err, zoom) => this.zoomToCluster(map, feature.geometry, err, zoom)
    );
  }

  private zoomToCluster(map: MapboxMap, geometry: Geometry, err: any, zoom: number): void {
    if (err) {
      return;
    }

    map.easeTo({
      center: this.convertToLngLatLike(geometry),
      zoom: zoom + 0.1
    });
  }

  private convertToLngLatLike(geometry: Geometry): LngLatLike {
    return (geometry as Point).coordinates as LngLatLike;
  }

  onLayerClicked(map: MapboxMap, feature: MapboxGeoJSONFeature, oldSelectedFeatureId: string): string {
    const selectedFeatureId = feature.properties?.id;
    if (!selectedFeatureId || selectedFeatureId === oldSelectedFeatureId) {
      this.unselectFeature(map);
      return undefined;
    }

    this.selectFeature(map, selectedFeatureId);
    const geometry = feature.geometry;
    if (geometry?.type === 'Point') {
      map.flyTo({center: this.convertToLngLatLike(geometry)});
    }

    return selectedFeatureId;
  }

  unselectFeature(map: MapboxMap): void {
    this.selectFeature(map, undefined);
  }

  private selectFeature(map: MapboxMap, selectedFeatureId: string): void {
    map.setFilter(Constants.MARKER_LAYER, this.createMarkerFilter(selectedFeatureId ?? '', false));
    map.setFilter(Constants.MARKER_SELECTED_LAYER, this.createMarkerFilter(selectedFeatureId ?? ''));
  }

  private createMarkerFilter(id: string, include = true): Array<any> {
    return ['all', ['!has', 'point_count'], [include ? 'in' : '!in', 'id', id]];
  }

  moveMap(map: MapboxMap, center: mapboxgl.LngLatLike, zoomLevel: number): void {
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

  private addMissingImages(map: mapboxgl.Map, markers: Marker[]): void {
    (markers ?? [])
      .filter(marker => marker.category === MarkerCategory.CUSTOM)
      .filter(marker => !map.hasImage(this.buildImageName(marker)))
      .forEach(marker => {
        const imageName = this.buildImageName(marker);
        this.addMissingImage(map, imageName, marker.icon, marker.iconSelected);
        // The image will later be loaded by the category name. Therefore we have to map it back.
        marker.category = imageName;
      });
  }

  private buildImageName(marker: Marker): string {
    return `${this.convertToImageName(marker.icon)}_${this.convertToImageName(marker.iconSelected)}`;
  }

  private convertToImageName(iconPath: string): string {
    return iconPath.substring(iconPath.lastIndexOf('/') + 1, iconPath.lastIndexOf('.'));
  }

  private verifyMarkers(markers: Marker[]): void {
    const invalidMarker = (markers ?? [])
      .filter(marker => marker.category === MarkerCategory.CUSTOM)
      .find(marker => !marker.icon || !marker.iconSelected);

    if (invalidMarker) {
      throw new Error(
        `Marker with id ${invalidMarker.id} and category CUSTOM is missing the required 'icon' or 'iconSelected' definition.`
      );
    }

  }

  private addMissingImage(map: mapboxgl.Map, name: string, icon: string, iconSelected: string): void {
    map.loadImage(icon, (error, image) => this.imageLoadedCallback(map, `sbb_${name}_red`, error, image));
    map.loadImage(iconSelected, (error, image) => this.imageLoadedCallback(map, `sbb_${name}_black`, error, image));
  }

  private imageLoadedCallback(map: mapboxgl.Map, name: string, error: any, image: any): void {
    if (error) {
      console.error(error);
    } else {
      map.addImage(name, image, {pixelRatio: 2});
    }
  }
}
