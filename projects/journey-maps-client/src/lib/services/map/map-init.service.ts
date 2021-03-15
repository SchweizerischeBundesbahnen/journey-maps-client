import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LngLatBoundsLike, LngLatLike, Map as MapboxMap, MapboxOptions, NavigationControl, Style} from 'mapbox-gl';
import {map, tap} from 'rxjs/operators';
import {Constants} from '../constants';
import {MarkerPriority} from '../../model/marker-priority.enum';
import {MultiTouchSupport} from '../multiTouchSupport';

@Injectable({
  providedIn: 'root'
})
export class MapInitService {

  private readonly defaultZoom = 7.5;
  private readonly defaultMapCenter: LngLatLike = [7.299265, 47.072120];
  private readonly defaultBoundingBox: LngLatBoundsLike = [[5.7, 47.9], [10.6, 45.7]]; // CH bounds;
  private readonly controlLabels = {
    de: {
      'NavigationControl.ZoomIn': 'Hineinzoomen',
      'NavigationControl.ZoomOut': 'Rauszoomen'
    },
    fr: {
      'NavigationControl.ZoomIn': 'Zoom avant',
      'NavigationControl.ZoomOut': 'Dézoomer'
    },
    it: {
      'NavigationControl.ZoomIn': 'Ingrandire',
      'NavigationControl.ZoomOut': 'Rimpicciolire'
    },
    en: {
      'NavigationControl.ZoomIn': 'Zoom in',
      'NavigationControl.ZoomOut': 'Zoom out'
    }
  };

  constructor(private http: HttpClient) {
  }

  initializeMap(
    mapNativeElement: any,
    language: string,
    styleUrl: string,
    zoomLevel?: number,
    mapCenter?: mapboxgl.LngLatLike,
    boundingBox?: LngLatBoundsLike,
    boundingBoxPadding?: number
  ): Observable<mapboxgl.Map> {
    const mapboxMap = new MapboxMap(this.createOptions(mapNativeElement, zoomLevel, mapCenter, boundingBox, boundingBoxPadding));

    this.translateControlLabels(mapboxMap, language);
    this.addControls(mapboxMap);

    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    mapboxMap.dragRotate.disable();
    mapboxMap.touchPitch.disable();

    return this.fetchStyle(styleUrl).pipe(
      tap(style => this.defineClusterSettings(style)),
      tap(style => mapboxMap.setStyle(style)),
      map(() => mapboxMap)
    );
  }

  private createOptions(
    container: any,
    zoomLevel?: number,
    mapCenter?: LngLatLike,
    boundingBox?: LngLatBoundsLike,
    boundingBoxPadding?: number): MapboxOptions {
    const options: mapboxgl.MapboxOptions = {
      container,
      minZoom: 1,
      maxZoom: 18,
      scrollZoom: true,
      dragRotate: false,
      fadeDuration: 10
    };

    if (zoomLevel || mapCenter) {
      options.zoom = zoomLevel ?? this.defaultZoom;
      options.center = mapCenter ?? this.defaultMapCenter;
    } else if (boundingBox) {
      options.bounds = boundingBox;
      options.fitBoundsOptions = {padding: boundingBoxPadding};
    } else {
      options.bounds = this.defaultBoundingBox;
    }

    return options;
  }

  private fetchStyle(styleUrl: string): Observable<Style> {
    return this.http.get(styleUrl).pipe(
      map(style => style as Style)
    );
  }

  private translateControlLabels(mapboxMap: MapboxMap, language: string): void {
    (mapboxMap as any)._locale = Object.assign(
      {},
      (mapboxMap as any)._locale,
      this.controlLabels[language]
    );
  }

  private addControls(mapboxMap: mapboxgl.Map): void {
    mapboxMap.addControl(
      new NavigationControl({showCompass: false}),
      'top-right'
    );
    mapboxMap.addControl(new MultiTouchSupport());
  }

  private defineClusterSettings(style: Style): void {
    const markerSource = style.sources[Constants.MARKER_SOURCE] as any;

    if (markerSource) {
      markerSource.cluster = true;
      markerSource.clusterRadius = Constants.CLUSTER_RADIUS;
      markerSource.clusterMinPoints = 2;
      markerSource.clusterProperties = {
        // Maximum priority of the markers inside the cluster.
        // Can be used in the map style for a custom cluster styling.
        // See e.g: https://gitlab.geops.de/sbb/sbb-styles/-/blob/dev/partials/parkandrail.json#L21
        priority: ['max', ['case', ['has', 'priority'], ['get', 'priority'], MarkerPriority.REGULAR]],
      };
    }
  }
}
