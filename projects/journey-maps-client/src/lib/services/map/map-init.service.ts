import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LngLatBoundsLike, LngLatLike, Map as MapboxMap, MapboxOptions, Style} from 'mapbox-gl';
import {map, tap} from 'rxjs/operators';
import {MultiTouchSupport} from '../multiTouchSupport';

@Injectable({
  providedIn: 'root'
})
export class MapInitService {

  public static MIN_ZOOM = 1;
  public static MAX_ZOOM = 23; /* same as in mobile-clients */

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
    allowScrollZoom: boolean,
    zoomLevel?: number,
    mapCenter?: mapboxgl.LngLatLike,
    boundingBox?: LngLatBoundsLike,
    boundingBoxPadding?: number,
    allowOneFingerPan?: boolean,
  ): Observable<mapboxgl.Map> {
    const mapboxMap = new MapboxMap(
      this.createOptions(mapNativeElement, allowScrollZoom, zoomLevel, mapCenter, boundingBox, boundingBoxPadding)
    );

    this.translateControlLabels(mapboxMap, language);
    this.addControls(mapboxMap, allowOneFingerPan);

    // https://docs.mapbox.com/mapbox-gl-js/example/toggle-interaction-handlers/
    mapboxMap.dragRotate.disable();
    mapboxMap.touchPitch.disable();

    return this.fetchStyle(styleUrl).pipe(
      tap(style => mapboxMap.setStyle(style)),
      map(() => mapboxMap)
    );
  }

  private createOptions(
    container: any,
    allowScrollZoom: boolean,
    zoomLevel?: number,
    mapCenter?: LngLatLike,
    boundingBox?: LngLatBoundsLike,
    boundingBoxPadding?: number): MapboxOptions {
    const options: mapboxgl.MapboxOptions = {
      container,
      minZoom: MapInitService.MIN_ZOOM,
      maxZoom: MapInitService.MAX_ZOOM,
      scrollZoom: allowScrollZoom,
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

  public fetchStyle(styleUrl: string): Observable<Style> {
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

  private addControls(mapboxMap: mapboxgl.Map, allowOneFingerPan?: boolean): void {
    if (!allowOneFingerPan) {
      mapboxMap.addControl(new MultiTouchSupport());
    }
  }
}
