import {AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Map as MapboxMap, MapLayerMouseEvent} from 'mapbox-gl';
import {MapInitService} from './services/map-init.service';
import {ReplaySubject, Subject} from 'rxjs';
import {debounceTime, delay, filter, map, take, takeUntil} from 'rxjs/operators';
import {MapService} from './services/map.service';
import {Constants} from './services/constants';
import {Marker} from './model/marker';


@Component({
  selector: 'rokas-journey-maps-client',
  templateUrl: './journey-maps-client.component.html',
  styleUrls: ['./journey-maps-client.component.scss']
})
export class JourneyMapsClientComponent implements OnInit, AfterViewInit, OnDestroy {

  selectedMarker: Marker = undefined;
  private map: MapboxMap;
  @ViewChild('map') private mapElementRef: ElementRef;
  private windowResized = new Subject<void>();
  private destroyed = new Subject<void>();
  private changeCoursor = new ReplaySubject<boolean>(1);
  private clusterClicked = new ReplaySubject<MapLayerMouseEvent>(1);
  private layerClicked = new ReplaySubject<MapLayerMouseEvent>(1);
  private styleLoaded = new ReplaySubject(1);

  constructor(private mapInitService: MapInitService,
              private mapService: MapService) {
  }

  private _language: string;

  get language(): string {
    return this._language;
  }

  @Input()
  set language(value: string) {
    if (value == null) {
      throw new TypeError('language mustn\'t be null');
    }

    value = value.toLowerCase();
    if (value === 'de' || value === 'fr' || value === 'it' || value === 'en') {
      this._language = value;
    } else {
      throw new TypeError('Illegal value for language. Allowed values are de|fr|it|en.');
    }
  }

  private _markers: Marker[];

  get markers(): Marker[] {
    return this._markers;
  }

  @Input()
  set markers(value: Marker[]) {
    this._markers = value;
    this.selectedMarker = undefined;

    if (this.map && this.map.isStyleLoaded()) {
      this.mapService.updateMarkers(this.map, value);
    } else {
      this.styleLoaded.pipe(
        take(1),
        delay(500)
      ).subscribe(() => this.mapService.updateMarkers(this.map, value));
    }
  }

  ngOnInit(): void {
    this.windowResized.pipe(
      debounceTime(500),
      takeUntil(this.destroyed)
    ).subscribe(() => this.map.resize());

    this.changeCoursor.pipe(
      debounceTime(50),
      takeUntil(this.destroyed)
    ).subscribe(isEnter => this.map.getCanvas().style.cursor = isEnter ? 'pointer' : '');

    this.styleLoaded.pipe(
      takeUntil(this.destroyed)
    ).subscribe(() => this.onStyleLoaded());

    this.layerClicked.pipe(
      filter(e => e?.features != null && e.features.length > 0),
      map(e => e.features),
      // CHECKME ses: When setting debounceTime as first operator then e.features is always undefined... Why?
      debounceTime(200),
      takeUntil(this.destroyed)
    ).subscribe(features => {
      const selectedMarkerId = this.mapService.onLayerClicked(this.map, features[0], this.selectedMarker?.id);
      this.selectedMarker = this.markers.find(marker => marker.id === selectedMarkerId && !!selectedMarkerId);
    });

    this.clusterClicked.pipe(
      debounceTime(200),
      filter(e => e != null),
      map(e => this.map.queryRenderedFeatures(e.point, {layers: [Constants.CLUSTER_LAYER]})),
      filter(features => features != null && features.length > 0),
      takeUntil(this.destroyed)
    ).subscribe(features => this.mapService.onClusterClicked(this.map, features[0]));
  }

  ngAfterViewInit(): void {
    // CHECKME ses: Lazy initialization with IntersectionObserver?
    this.mapInitService.initializeMap(this.mapElementRef.nativeElement, this.language).subscribe(
      m => {
        this.map = m;
        this.registerStyleLoadedHandler();
      }
    );
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.windowResized.next();
  }

  private registerStyleLoadedHandler(): void {
    if (this.map.isStyleLoaded()) {
      this.styleLoaded.next();
    } else {
      this.map.on('style.load', () => this.styleLoaded.next());
    }
  }

  private onStyleLoaded(): void {
    this.mapService.onMapLoaded(this.map);
    for (const layer of Constants.LAYERS) {
      this.map.setLayoutProperty(layer, 'visibility', 'visible');
      this.map.on('mouseenter', layer, () => this.changeCoursor.next(true));
      this.map.on('mouseleave', layer, () => this.changeCoursor.next(false));
    }

    for (const infoLayer of Constants.INFO_LAYERS) {
      this.map.on('click', infoLayer, event => this.layerClicked.next(event));
    }

    this.map.on('click', Constants.CLUSTER_LAYER, event => this.clusterClicked.next(event));

    // CHECKME ses: Handle missing map image
  }

  onInfoboxCloseClicked(): void {
    this.selectedMarker = undefined;
    this.mapService.unselectFeature(this.map);
  }
}
