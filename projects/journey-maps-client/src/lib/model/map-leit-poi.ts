import {Subject} from 'rxjs';
import {ComponentRef} from '@angular/core';
import {LeitPoiComponent} from '../components/leit-poi/leit-poi.component';
import * as mapboxgl from 'mapbox-gl';

/**
 * MapLeitPoi groups the LeitPoiComponent and the mapboxgl.Popup container and helps to clenaup both instances on destroy.
 */
export class MapLeitPoi {

  private destroySub = new Subject<void>();

  constructor(private componentRef: ComponentRef<LeitPoiComponent>, private popup: mapboxgl.Popup) {
  }

  get destroyed(): Subject<void> {
    return this.destroySub;
  }

  get switchLevel(): Subject<number> {
    return this.componentRef.instance.switchLevel;
  }

  destroy(): void {
    this.destroySub.next();
    this.destroySub.complete();
    this.popup.remove();
    this.componentRef.destroy();
  }
}
