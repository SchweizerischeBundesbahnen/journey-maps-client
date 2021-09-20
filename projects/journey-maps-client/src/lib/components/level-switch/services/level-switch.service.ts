import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {Map as MapboxMap} from 'mapbox-gl';
import {BehaviorSubject, Subject} from 'rxjs';
import {LocaleService} from '../../../services/locale.service';
import {QueryMapFeaturesService} from './query-map-features.service';
import {MapLeitPoiService} from '../../../services/map/map-leit-poi.service';
import {MapTransferService} from '../../../services/map/map-transfer.service';
import {takeUntil} from 'rxjs/operators';
import {MapLayerFilterService} from './map-layer-filter.service';

@Injectable({
  providedIn: 'root'
})
export class LevelSwitchService implements OnDestroy {

  private map: mapboxgl.Map;
  private lastZoom: number; // needed to detect when we cross zoom threshold to show or hide the level switcher component

  private readonly defaultLevel = 0;
  // same minZoom as in Android and iOS map
  private readonly levelButtonMinMapZoom = 15;
  private readonly _selectedLevel = new BehaviorSubject<number>(0);
  private readonly _availableLevels = new BehaviorSubject<number[]>([]);
  private readonly _visibleLevels = new BehaviorSubject<number[]>([]);

  private readonly zoomChanged = new Subject<void>(); // gets triggered by the map's 'zoomend' event and calls onZoomChanged()
  private readonly mapMoved = new Subject<void>(); // gets triggered by the map's 'moveend' event and calls updateLevels()
  private readonly destroyed = new Subject<void>(); // needed to detect when the component is destroyed to unsubscribe the other observables

  // service design inspired by https://www.maestralsolutions.com/angular-application-state-management-you-do-not-need-external-data-stores/
  readonly selectedLevel$ = this._selectedLevel.asObservable();
  readonly visibleLevels$ = this._visibleLevels.asObservable();
  // changeDetectionEmitter inspired by https://stackoverflow.com/a/48736591/349169
  readonly changeDetectionEmitter = new EventEmitter<void>();

  getSelectedLevel(): number {
    return this._selectedLevel.getValue();
  }

  setSelectedLevel(selectedLevel: number): void {
    this._selectedLevel.next(selectedLevel);
  }

  getAvailableLevels(): number[] {
    return this._availableLevels.getValue();
  }

  setAvailableLevels(availableLevels: number[]): void {
    this._availableLevels.next(availableLevels);
    this.updateIsLevelSwitchVisible();
  }

  getVisibleLevels(): number[] {
    return this._visibleLevels.getValue();
  }

  constructor(private mapLayerFilterService: MapLayerFilterService,
              private i18n: LocaleService,
              private queryMapFeaturesService: QueryMapFeaturesService,
              private mapLeitPoiService: MapLeitPoiService,
              private mapTransferService: MapTransferService) {
    this.setSelectedLevel(this.defaultLevel);
  }

  private isVisibleInCurrentMapZoomLevel(): boolean {
    return this.map?.getZoom() >= this.levelButtonMinMapZoom;
  }

  private isVisible(): boolean {
    return this.isVisibleInCurrentMapZoomLevel() && this.getAvailableLevels().length > 0;
  }

  onInit(map: MapboxMap): void {
    this.map = map;
    this.lastZoom = this.map.getZoom();
    this.map.on('zoomend', () => this.zoomChanged.next());
    this.map.on('moveend', () => this.mapMoved.next());

    this.mapLayerFilterService.setMap(this.map);
    if (this.map.isSourceLoaded(QueryMapFeaturesService.SERVICE_POINT_SOURCE_ID)) {
      this.updateLevels();
    } else {
      this.map.once('idle', () => this.updateLevels());
    }
    // call outside component-zone, trigger detect changes manually
    this.changeDetectionEmitter.emit();

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

    // called whenever the level is switched via the leit-pois (or when the map is set to a specific floor for a new transfer)
    this.mapLeitPoiService.levelSwitched.pipe(takeUntil(this.destroyed))
      .subscribe((nextLevel) => {
        this.setSelectedLevel(nextLevel);
      });

    this._selectedLevel.pipe(takeUntil(this.destroyed))
      .subscribe(selectedLevel => {
        this.mapLayerFilterService.setLevelFilter(selectedLevel);
        this.mapTransferService.updateOutdoorWalkFloor(this.map, selectedLevel);
        // call outside component-zone, trigger detect changes manually
        this.changeDetectionEmitter.emit();
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  switchLevel(level: number): void {
    this.setSelectedLevel(level);
    this.mapLeitPoiService.setCurrentLevel(this.map, level);
  }

  getLevelLabel(level: number): string {
    const txt1 = this.i18n.getText('a4a.visualFunction');
    const txt2 = this.i18n.getTextWithParams('a4a.selectFloor', level);
    return `${txt1} ${txt2}`;
  }

  /**
   * gets called every time the map's 'zoomend' event triggers the 'zoomChanged' observable
   */
  private onZoomChanged(): void {
    this.updateIsLevelSwitchVisible();
    // diff < 0 means that we crossed (in either direction) the threshold to display the level switch component.
    // diff = 0 means that we touched (before or after zoomChanged) the threshold to display the level switch component.
    const diff = (this.levelButtonMinMapZoom - this.lastZoom) * (this.levelButtonMinMapZoom - this.map.getZoom());
    if (diff <= 0) {
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
    this.setDefaultLevelIfNotVisible();
    this.lastZoom = this.map.getZoom();
  }

  private updateIsLevelSwitchVisible(): void {
    if (this.isVisibleInCurrentMapZoomLevel()) {
      this._visibleLevels.next(this.getAvailableLevels());
    } else {
      this._visibleLevels.next([]);
    }
  }

  private setDefaultLevelIfNotVisible(): void {
    // Set default level when level switch is not visible
    const shouldSetDefaultLevel = !this.isVisible() && this.getSelectedLevel() !== this.defaultLevel;
    if (shouldSetDefaultLevel) {
      this.switchLevel(this.defaultLevel);
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
  }

  /**
   * gets called when the map is initialized and then again every time the map's 'moveend' event triggers the 'mapMoved' observable
   */
  private updateLevels(): void {
    if (this.isVisibleInCurrentMapZoomLevel()) {
      const currentLevels = this.queryMapFeaturesService.getVisibleLevels(this.map);
      this.updateLevelsIfChanged(currentLevels);
    }

    this.setDefaultLevelIfNotVisible();
  }

  private updateLevelsIfChanged(levels: number[]): void {
    if (JSON.stringify(this.getAvailableLevels()) !== JSON.stringify(levels)) {
      this.setAvailableLevels(levels);
      // if selected level not in new levels list:
      if (this.getAvailableLevels().indexOf(this.getSelectedLevel()) === -1) {
        this.switchLevel(this.defaultLevel);
      }
      // call outside component-zone, trigger detect changes manually
      this.changeDetectionEmitter.emit();
    }
  }
}
