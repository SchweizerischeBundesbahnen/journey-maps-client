import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Map as MapboxMap} from 'mapbox-gl';
import {Subject} from 'rxjs';
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
export class LevelSwitchComponent implements OnInit, OnChanges, OnDestroy {
  @Input() map: MapboxMap;

  // levels could be configurable or dynamically calculated by current map-extent in the future
  levels = [2, 1, 0, -1, -2, -4];
  selectedLevel: number;
  private readonly defaultLevel = 0;
  // same minZoom as in Android and iOS map
  private readonly levelButtonMinMapZoom = 15;
  private lastZoom: number;
  private zoomChanged = new Subject<void>();
  private destroyed = new Subject<void>();

  constructor(private ref: ChangeDetectorRef, private mapLayerFilterService: MapLayerFilterService) {
    this.selectedLevel = this.defaultLevel;
  }

  ngOnInit(): void {
    this.zoomChanged
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.onZoomChanged();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue) {
      this.lastZoom = this.map.getZoom();
      this.map.on('zoomend', () => this.zoomChanged.next());
      this.mapLayerFilterService.setMap(this.map);
      // call outside component-zone, trigger detect changes manually
      this.ref.detectChanges();
    }
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
    return this.map?.getZoom() >= this.levelButtonMinMapZoom;
  }

  private onZoomChanged(): void {
    // diff <= 0 means that we passed the threshold to display the level switch component.
    const diff = (this.levelButtonMinMapZoom - this.lastZoom) * (this.levelButtonMinMapZoom - this.map.getZoom());
    // Set default level when level switch is not visible
    const shouldSetDefaultLevel = !this.isVisible && this.selectedLevel !== this.defaultLevel;

    if (shouldSetDefaultLevel) {
      this.switchLevel(this.defaultLevel);
    }
    if (shouldSetDefaultLevel || diff <= 0) {
      // call outside component-zone, trigger detect changes manually
      this.ref.detectChanges();
    }

    this.lastZoom = this.map.getZoom();
  }
}
