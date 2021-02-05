import {Injectable} from '@angular/core';
import {FlyToOptions, GeoJSONSource, LngLat, LngLatLike, LngLatBounds, LngLatBoundsLike, Map as MapboxMap, MapboxGeoJSONFeature} from 'mapbox-gl';
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

  updateMarkers(map: MapboxMap, markers: Marker[], selectedMarker: Marker): void {
    this.verifyMarkers(markers);
    if (!selectedMarker) {
      this.unselectFeature(map);
    }
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
  }

  private getMarkerSource(map: MapboxMap): GeoJSONSource {
    return map.getSource(Constants.MARKER_SOURCE) as GeoJSONSource;
  }

  onClusterClicked(map: MapboxMap, cluster: MapboxGeoJSONFeature): void {
    this.zoomToCluster(map, cluster.properties.cluster_id, this.convertToLngLatLike(cluster.geometry));
  }

  private zoomToCluster(map: MapboxMap, clusterId: any, center: LngLatLike): void {
    this.getMarkerSource(map).getClusterExpansionZoom(
      clusterId,
      (err, zoom) => {
        if (!err) {
          map.easeTo({center, zoom: zoom + 0.1});
        }
      }
    );
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

  selectMarker(map: MapboxMap, marker: Marker): void {
    this.selectFeature(map, marker.id);

    const features = map.queryRenderedFeatures(
      map.project(marker.position as LngLatLike),
      {
        layers: [Constants.MARKER_LAYER, Constants.MARKER_SELECTED_LAYER],
        filter: ['in', 'id', marker.id]
      }
    );

    if (features && features.length) {
      // Marker is already visible on map.
      // Center map to marker.
      map.flyTo({center: marker.position as LngLatLike});
    } else {
      let cluster = this.queryClusterAtPosition(map, marker.position);
      if (cluster) {
        this.zoomUntilMarkerVisible(map, cluster, marker);
      } else {
        // We have to fly to the marker position first before we can query it.
        // We add a one-time handler which gets executed after the flyTo() call.
        map.once('moveend', () => {
            cluster = this.queryClusterAtPosition(map, marker.position);
            if (cluster) {
              // Zooming won't work without the timeout.
              setTimeout(() => this.zoomUntilMarkerVisible(map, cluster, marker), 250);
            }
          }
        );
        map.flyTo({center: marker.position as LngLatLike});
      }
    }
  }

  private queryClusterAtPosition(map: MapboxMap, position: GeoJSON.Position): MapboxGeoJSONFeature {
    const point = map.project(position as LngLatLike);
    const range = Constants.CLUSTER_RADIUS / 2;

    const clusters = map.queryRenderedFeatures([
        [point.x - range, point.y - range],
        [point.x + range, point.y + range]
      ],
      {
        layers: [Constants.CLUSTER_LAYER]
      }
    );

    return clusters?.length ? clusters[0] : undefined;
  }

  private zoomUntilMarkerVisible(map: MapboxMap, cluster: GeoJSON.Feature, marker: Marker, found: boolean[] = []): void {
    const clusterId = cluster.properties.cluster_id;
    this.getMarkerSource(map).getClusterChildren(
      clusterId,
      (e1, children) => {
        // Skip processing if marker has been found
        if (!found.length) {
          for (const child of children) {
            if (child.id === marker.id) {
              found.push(true);
              this.zoomToCluster(map, clusterId, marker.position as LngLatLike);
            } else if (child.properties.cluster === true) {
              this.zoomUntilMarkerVisible(map, child, marker, found);
            }
          }
        }
      }
    );
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

  /**
   * Move the map to target according to the following priorities :
   * 1. zoom + center
   * 2. bounding box
   * 3. markes bounds
   */
  moveMap(map: MapboxMap, center: LngLatLike, zoomLevel: number, boundingBox: LngLatBoundsLike, markersBounds: LngLatBounds): void {
    if ( zoomLevel || center) {
      this.centerMap(map, center, zoomLevel);
    } else if (boundingBox) {
       map.fitBounds(boundingBox);
    } else if (markersBounds) {
       map.fitBounds(markersBounds, {padding: 40}); // TODO DKU duplicate :-/
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

  private addMissingImages(map: mapboxgl.Map, markers: Marker[]): void {
    const images = new Map<string, Marker>();

    (markers ?? [])
      .filter(marker => marker.category === MarkerCategory.CUSTOM)
      .forEach(marker => {
        const imageName = this.buildImageName(marker);
        images.set(imageName, marker);
        // The image will later be loaded by the category name.
        // Therefore we have to overwrite the category.
        marker.category = imageName;
      });

    for (const [imageName, marker] of images) {
      // see https://gitlab.geops.de/sbb/sbb-styles/-/blob/184754aee94c82b3511be07e2a93474a61025068/partials/bvi.json#L18
      const iconName = `sbb_${imageName}_red`;
      const iconSelectedName = `sbb_${imageName}_black`;

      if (!map.hasImage(iconName)) {
        this.addMissingImage(map, iconName, marker.icon);
      }
      if (!map.hasImage(iconSelectedName)) {
        this.addMissingImage(map, iconSelectedName, marker.iconSelected);
      }
    }
  }

  private buildImageName(marker: Marker): string {
    const simpleHash = this.simpleHash(`${marker.icon}${marker.iconSelected}`);
    return `${this.convertToImageName(marker.icon)}_${this.convertToImageName(marker.iconSelected)}_${simpleHash}`;
  }

  private convertToImageName(iconPath: string): string {
    return iconPath.substring(iconPath.lastIndexOf('/') + 1, iconPath.lastIndexOf('.'));
  }

  private simpleHash(value: string): string {
    return String(Math.abs(
      // https://stackoverflow.com/a/34842797/349169
      // tslint:disable-next-line:no-bitwise
      value.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0))
    );
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

  private addMissingImage(map: mapboxgl.Map, name: string, icon: string): void {
    map.loadImage(icon, (error, image) => this.imageLoadedCallback(map, name, error, image));
  }

  private imageLoadedCallback(map: mapboxgl.Map, name: string, error: any, image: any): void {
    if (error) {
      console.error(error);
    } else {
      map.addImage(name, image, {pixelRatio: 2});
    }
  }
}
