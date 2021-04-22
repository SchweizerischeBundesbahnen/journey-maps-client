import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Map as MapboxMap} from 'mapbox-gl';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'rokas-zoom-controls',
  templateUrl: './zoom-controls.component.html',
  styleUrls: ['./zoom-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoomControlsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() map: MapboxMap;

  private zoomChanged = new Subject<void>();
  private destroyed = new Subject<void>();
  isMinZoom: boolean;
  isMaxZoom: boolean;

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.zoomChanged
      .pipe(takeUntil(this.destroyed))
      .subscribe(() => {
        this.onZoomChanged();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.map?.currentValue) {
      this.map.on('zoomend', () => {
        this.zoomChanged.next();
        // when using the mouse whell to zoom, automatic change detection doesn't work
        this.ref.detectChanges();
      });

      if (!changes.map.previousValue) {
        // only do this the first time map is set
        this.setIsMinMaxZoom();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private onZoomChanged(): void {
    this.setIsMinMaxZoom();
  }

  private setIsMinMaxZoom(): void {
    this.isMinZoom = this.map.getZoom() === this.map.getMinZoom();
    this.isMaxZoom = this.map.getZoom() === this.map.getMaxZoom();
  }

  zoomIn(): void {
    this.map.zoomIn();
  }

  zoomOut(): void {
    this.map.zoomOut();
  }
}
