import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Map as MapboxMap} from 'mapbox-gl';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MapLayerFilterService} from '../info-box/services/map-layer-filter.service';

@Component({
  selector: 'rokas-level-switch',
  templateUrl: './level-switch.component.html',
  styleUrls: ['./level-switch.component.scss'],
  providers: [MapLayerFilterService],
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
  @Input() mapReady: Subject<MapboxMap>;
  levels = [2, 1, 0, -1, -2, -4];
  public mapIsReady: boolean;
  private destroyed = new Subject<void>();

  constructor(private ref: ChangeDetectorRef, private mapLayerFilterService: MapLayerFilterService) {
    this.setMapReady(false);
  }

  ngOnInit(): void {
    this.mapReady
      .pipe(takeUntil(this.destroyed))
      .subscribe((map) => this.onMapReady(map));
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private onMapReady(map: MapboxMap): void {
    this.mapLayerFilterService.setMap(map);
    this.setMapReady(true);
  }

  switchLevel(level: number): void {
    this.mapLayerFilterService.setLevelFilter(level);
  }

  setMapReady(isReady: boolean): void {
    this.mapIsReady = isReady;
    this.ref.markForCheck();
  }
}
