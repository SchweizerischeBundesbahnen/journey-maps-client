import {ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Map as MapboxMap} from 'mapbox-gl';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'rokas-zoom-controls',
  templateUrl: './zoom-controls.component.html',
  styleUrls: ['./zoom-controls.component.scss'],
})
export class ZoomControlsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() map: MapboxMap;

  private lastZoom: number;
  private zoomChanged = new Subject<void>();
  private destroyed = new Subject<void>();

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
      this.lastZoom = this.map.getZoom();
      this.map.on('zoomend', () => this.zoomChanged.next());
      // call outside component-zone, trigger detect changes manually
      this.ref.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private onZoomChanged(): void {
    this.lastZoom = this.map.getZoom();
  }

  zoomIn(): void {

  }

  zoomOut(): void {

  }
}
