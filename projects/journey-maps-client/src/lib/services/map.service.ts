import {Injectable} from '@angular/core';
import {GeoJSONSource, LngLatLike, Map as MapboxMap, MapboxGeoJSONFeature} from 'mapbox-gl';
import {Constants} from './constants';
import {Marker} from '../model/marker';
import {MarkerConverterService} from './marker-converter.service';
import {Geometry, Point} from 'geojson';


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
    this.unselectFeature(map);

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
      zoom
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

  unselectFeature(map: mapboxgl.Map): void {
    this.selectFeature(map, undefined);
  }

  private selectFeature(map: MapboxMap, selectedFeatureId: string): void {
    map.setFilter(Constants.MARKER_LAYER, this.createMarkerFilter(selectedFeatureId ?? '', false));
    map.setFilter(Constants.MARKER_SELECTED_LAYER, this.createMarkerFilter(selectedFeatureId ?? ''));
  }

  private createMarkerFilter(id: string, include = true): Array<any> {
    return ['all', ['!has', 'point_count'], [include ? 'in' : '!in', 'id', id]];
  }
}
