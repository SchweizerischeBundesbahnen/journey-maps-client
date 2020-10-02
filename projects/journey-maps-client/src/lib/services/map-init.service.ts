import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Map as MapboxMap, NavigationControl, Style} from 'mapbox-gl';
import {map, tap} from 'rxjs/operators';
import {Constants} from './constants';

@Injectable({
  providedIn: 'root'
})
// TODO ses: Magic numbers as constants
export class MapInitService {

  private readonly styleUrl = 'https://api.maptiler.com/maps/16bebf72-aee9-4a63-9ae6-018a6615455c/style.json?key=9BD3inXxrAPHVp6fEoMN';
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

  initializeMap(mapNativeElement: any, language: string): Observable<MapboxMap> {
    const mapboxMap = new MapboxMap(this.createOptions(mapNativeElement));

    this.translateControlLabels(mapboxMap, language);
    this.addControls(mapboxMap);

    return this.fetchStyle().pipe(
      tap(style => this.defineClusterSettings(style)),
      tap(style => mapboxMap.setStyle(style)),
      map(() => mapboxMap)
    );
  }

  private createOptions(container: any): mapboxgl.MapboxOptions {
    return {
      container,
      minZoom: 5,
      maxZoom: 18,
      // center: [7.4391326448171196, 46.948834547463086],
      // zoom: 15,
      scrollZoom: true,
      dragRotate: false,
      bounds: [
        [5.7, 47.9],
        [10.6, 45.7]
      ] as any, // CH bounds
      fadeDuration: 10
    };
  }

  private fetchStyle(): Observable<Style> {
    return this.http.get(this.styleUrl).pipe(
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
      'top-left'
    );
  }

  private defineClusterSettings(style: Style): void {
    const markerSource = style.sources[Constants.MARKER_SOURCE] as any;
    if (markerSource) {
      markerSource.cluster = true;
      markerSource.clusterRadius = 50;
      markerSource.clusterMinPoints = 2;
    }
  }
}
