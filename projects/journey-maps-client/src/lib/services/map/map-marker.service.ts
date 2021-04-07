import {Injectable} from '@angular/core';
import {GeoJSONSource, LngLatLike, Map as MapboxMap, MapboxGeoJSONFeature} from 'mapbox-gl';
import {Constants} from '../constants';
import {Marker} from '../../model/marker';
import {MarkerConverterService} from '../marker-converter.service';
import {MarkerCategory} from '../../model/marker-category.enum';
import {MapService} from './map.service';


@Injectable({providedIn: 'root'})
export class MapMarkerService {

  constructor(private markerConverter: MarkerConverterService,
              private mapService: MapService) {
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

    const newData = {...this.mapService.emptyFeatureCollection};
    newData.features = features;
    markerSource.setData(newData);
  }

  private getMarkerSource(map: MapboxMap): GeoJSONSource {
    return map.getSource(Constants.MARKER_SOURCE) as GeoJSONSource;
  }

  onClusterClicked(map: MapboxMap, cluster: MapboxGeoJSONFeature): void {
    this.zoomToCluster(map, cluster.properties.cluster_id, this.mapService.convertToLngLatLike(cluster.geometry));
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

  onLayerClicked(map: MapboxMap, feature: MapboxGeoJSONFeature, oldSelectedFeatureId: string): string {
    const selectedFeatureId = feature.properties?.id;
    if (!selectedFeatureId || selectedFeatureId === oldSelectedFeatureId) {
      this.unselectFeature(map);
      return undefined;
    }

    this.selectFeature(map, selectedFeatureId);
    const geometry = feature.geometry;
    if (geometry?.type === 'Point') {
      map.flyTo({center: this.mapService.convertToLngLatLike(geometry)});
    }

    return selectedFeatureId;
  }

  selectMarker(map: MapboxMap, marker: Marker): void {
    this.selectFeature(map, marker.id);

    const features = map.queryRenderedFeatures(
      map.project(marker.position as LngLatLike),
      {
        layers: [Constants.MARKER_LAYER, Constants.MARKER_LAYER_SELECTED],
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
    map.setFilter(Constants.MARKER_LAYER_SELECTED, this.createMarkerFilter(selectedFeatureId ?? ''));
  }

  private createMarkerFilter(id: string, include = true): Array<any> {
    return ['all', ['!has', 'point_count'], [include ? 'in' : '!in', 'id', id]];
  }

  // visible for testing
  addMissingImages(map: mapboxgl.Map, markers: Marker[]): void {
    const images = new Map<string, string>();

    (markers ?? [])
      .filter(marker => marker.category === MarkerCategory.CUSTOM)
      .forEach(marker => {
        // The image will later be loaded by the category name.
        // Therefore we have to overwrite the category.
        // We also need to use the same naming convention that we use in the map style.
        // see https://gitlab.geops.de/sbb/sbb-styles/-/blob/dev/partials/_ki.json#L28
        const imageName = this.buildImageName(marker);
        marker.category = imageName;
        // TODO Dark mode support ?
        images.set(`sbb-marker_bright-inactive-black_${imageName}`, marker.icon);
        images.set(`sbb-marker_bright-active-red_${imageName}`, marker.iconSelected);
      });

    for (const [imageName, icon] of images) {
      if (!map.hasImage(imageName)) {
        this.mapService.addMissingImage(map, imageName, icon);
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

  private simpleHash(value: string): number {
    return Math.abs(
      // https://stackoverflow.com/a/34842797/349169
      // tslint:disable-next-line:no-bitwise
      value.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)
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
}
