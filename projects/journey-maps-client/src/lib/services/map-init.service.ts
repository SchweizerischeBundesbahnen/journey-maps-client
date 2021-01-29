import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LngLatLike, LngLatBoundsLike, Map as MapboxMap, NavigationControl, Style, FitBoundsOptions, MapboxOptions} from 'mapbox-gl';
import {map, tap} from 'rxjs/operators';
import {Constants} from './constants';

@Injectable({
  providedIn: 'root'
})
export class MapInitService {

  private readonly defaultZoom = 7.5;
  private readonly defaultMapCenter: LngLatLike = [7.299265, 47.072120];
  private readonly defaultBoundingBox: LngLatBoundsLike = [[5.7, 47.9], [10.6, 45.7]]; // CH bounds;
  private readonly defaultBoundsPadding: FitBoundsOptions = {padding: 40, duration: 0};
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
    markersBounds?: LngLatBoundsLike
  ): Observable<mapboxgl.Map> {
    const mapboxMap = new MapboxMap(this.createOptions(mapNativeElement, zoomLevel, mapCenter, boundingBox));

    if (!zoomLevel && !mapCenter && !boundingBox) {
      this.fitBoundsToMarkers(mapboxMap, markersBounds);
    }

    this.translateControlLabels(mapboxMap, language);
    this.addControls(mapboxMap);
    this.toggleInteractions(mapboxMap);

    return this.fetchStyle(styleUrl).pipe(
      tap(style => this.defineClusterSettings(style)),
      tap(style => mapboxMap.setStyle(style)),
      map(() => mapboxMap)
    );
  }

  private createOptions(container: any, zoomLevel?: number, mapCenter?: LngLatLike, boundingBox?: LngLatBoundsLike): MapboxOptions {
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
    } else {
      options.bounds = this.defaultBoundingBox;
    }

    return options;
  }

  private fitBoundsToMarkers(mapboxMap: MapboxMap, markersBounds?: LngLatBoundsLike): void {
    if (markersBounds) {
      mapboxMap.fitBounds(markersBounds,  this.defaultBoundsPadding);
    }
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

  private toggleInteractions(mapboxMap: mapboxgl.Map): void {
    mapboxMap.scrollZoom.disable();
  }

  private addControls(mapboxMap: mapboxgl.Map): void {
    mapboxMap.addControl(
      new NavigationControl({showCompass: false}),
      'top-right'
    );
  }

  private defineClusterSettings(style: Style): void {
    const markerSource = style.sources[Constants.MARKER_SOURCE] as any;
    if (markerSource) {
      markerSource.cluster = true;
      markerSource.clusterRadius = Constants.CLUSTER_RADIUS;
      markerSource.clusterMinPoints = 2;
    }
  }
}
