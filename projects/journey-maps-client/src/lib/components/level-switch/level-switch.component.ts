import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Map as MapboxMap} from 'mapbox-gl';
import {Subject} from 'rxjs';
  import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'rokas-level-switch',
  templateUrl: './level-switch.component.html',
  styleUrls: ['./level-switch.component.scss']
})
export class LevelSwitchComponent implements OnInit, OnDestroy {

  @Input() levels: number[];
  @Input() mapReady: Subject<MapboxMap>;
  private destroyed = new Subject<void>();
  private map: MapboxMap;

  constructor() {
  }

  ngOnInit(): void {
    this.mapReady.pipe(takeUntil(this.destroyed)).subscribe((map) => this.onMapReady(map));
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private onMapReady(map: MapboxMap): void {
    this.map = map;
    console.log('map style was loaded:', this.map.getStyle());
  }
}
