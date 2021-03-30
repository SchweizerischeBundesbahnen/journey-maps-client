import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Map as MapboxMap} from 'mapbox-gl';
import {ReplaySubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MapLayerFilterService} from './services/map-layer-filter.service';

@Component({
  selector: 'rokas-level-switch',
  templateUrl: './level-switch.component.html',
  styleUrls: ['./level-switch.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('fade', [
      state('in', style({opacity: 1})),
      transition(':enter', [
        style({opacity: 0}),
        animate(150)
      ]),
      transition(':leave',
        animate(150, style({opacity: 0})))
    ])
  ]
})
export class LevelSwitchComponent implements OnInit, OnDestroy {
  @Input() mapReady: Subject<MapboxMap> = new ReplaySubject<mapboxgl.Map>(1);
  // levels could be configurable or dynamically calculated by current map-extent in the future
  levels = [2, 1, 0, -1, -2, -4];
  selectedLevel: number;
  private readonly defaultLevel = 0;
  // same minZoom as in Android and iOS map
  private readonly levelButtonMinMapZoom = 15;
  private zoomChanged = new Subject<number>();
  private mapIsReady: boolean;
  private destroyed = new Subject<void>();
  private map?: mapboxgl.Map;

  constructor(private ref: ChangeDetectorRef, private mapLayerFilterService: MapLayerFilterService) {
    this.setMapReady(false);
    this.selectedLevel = this.defaultLevel;
  }

  ngOnInit(): void {
    if (this.mapReady == null) {
      throw new Error('mapReady input parameter must not be null');
    }
    this.mapReady
      .pipe(takeUntil(this.destroyed))
      .subscribe((map) => {
        this.onMapReady(map);
        // call outside component-zone, trigger detect changes manually
        this.ref.detectChanges();
      });

    this.zoomChanged
      .pipe(takeUntil(this.destroyed))
      .subscribe((newZoom) => {
        this.onZoomChanged(newZoom);
        // call outside component-zone, trigger detect changes manually
        this.ref.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  switchLevel(level: number): void {
    this.selectedLevel = level;
    this.mapLayerFilterService.setLevelFilter(level);
  }

  get isVisible(): boolean {
    return this.mapIsReady && this.map?.getZoom() >= this.levelButtonMinMapZoom;
  }

  private onMapReady(map: MapboxMap): void {
    this.map = map;
    this.map.on('zoomend', () => this.zoomChanged.next(this.map?.getZoom()));
    this.mapLayerFilterService.setMap(map);
    this.setMapReady(true);
  }

  private setMapReady(isReady: boolean): void {
    this.mapIsReady = isReady;
  }

  private onZoomChanged(newZoom: number): void {
    if (!this.isVisible && this.selectedLevel !== this.defaultLevel) {
      this.switchLevel(this.defaultLevel);
    }
  }
}
