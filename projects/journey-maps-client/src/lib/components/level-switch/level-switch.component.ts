import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Map as MapboxMap} from 'mapbox-gl';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MapLayerFilterService} from './services/map-layer-filter.service';
import {LocaleService} from '../../services/locale.service';
import {QueryMapFeaturesService} from './services/query-map-features.service';

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
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelSwitchComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private ref: ChangeDetectorRef,
              private mapLayerFilterService: MapLayerFilterService,
              private i18n: LocaleService,
              private queryMapFeaturesService: QueryMapFeaturesService) {
    this.selectedLevel = this.defaultLevel;
  }

  static defaultLevels = [2, 1, 0, -1, -2, -4];
  @Input() map: MapboxMap;

  // levels could be configurable or dynamically calculated by current map-extent in the future

  levels = LevelSwitchComponent.defaultLevels;
  selectedLevel: number;
  private readonly defaultLevel = 0;
  // same minZoom as in Android and iOS map
  private readonly levelButtonMinMapZoom = 15;
  private lastZoom: number;
  private zoomChanged = new Subject<void>();
  private mapMoved = new Subject<void>();
  private destroyed = new Subject<void>();

  get isVisibleInCurrentMapZoomLevel(): boolean {
    return this.map?.getZoom() >= this.levelButtonMinMapZoom;
  }

  get isVisible(): boolean {
    return this.isVisibleInCurrentMapZoomLevel && this.levels.length > 0;
  }

  ngOnInit(): void {
    this.zoomChanged
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.onZoomChanged();
      });

    this.mapMoved
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.updateLevels();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue) {
      this.lastZoom = this.map.getZoom();
      this.map.on('zoomend', () => this.zoomChanged.next());
      this.map.on('moveend', () => this.mapMoved.next());

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

  getLevelLabel(level: number): string {
    const txt1 = this.i18n.getText('a4a.visualFunction');
    const txt2 = this.i18n.getTextWithParams('a4a.selectFloor', level);
    return `${txt1} ${txt2}`;
  }

  private onZoomChanged(): void {
    // diff <= 0 means that we passed the threshold to display the level switch component.
    const diff = (this.levelButtonMinMapZoom - this.lastZoom) * (this.levelButtonMinMapZoom - this.map.getZoom());
    if (diff <= 0) {
      // call outside component-zone, trigger detect changes manually
      this.ref.detectChanges();
    }
    this.setDefaultLevelIfNotVisible();
    this.lastZoom = this.map.getZoom();
  }

  private setDefaultLevelIfNotVisible(): void {
    // Set default level when level switch is not visible
    const shouldSetDefaultLevel = !this.isVisible && this.selectedLevel !== this.defaultLevel;
    if (shouldSetDefaultLevel) {
      this.switchLevel(this.defaultLevel);
      // call outside component-zone, trigger detect changes manually
      this.ref.detectChanges();
    }
  }

  private updateLevels(): void {
    if (this.isVisibleInCurrentMapZoomLevel) {
      const currentLevels = this.queryMapFeaturesService.getVisibleLevels(this.map);
      this.updateLevelsIfChanged(currentLevels);
    }

    this.setDefaultLevelIfNotVisible();
  }

  private updateLevelsIfChanged(levels: number[]): void {
    if (JSON.stringify(this.levels) !== JSON.stringify(levels)) {
      this.levels = levels;
      // if selected level not in new levels list:
      if (this.levels.indexOf(this.selectedLevel) === -1) {
        this.switchLevel(this.defaultLevel);
      }
      // call outside component-zone, trigger detect changes manually
      this.ref.detectChanges();
    }
  }
}
