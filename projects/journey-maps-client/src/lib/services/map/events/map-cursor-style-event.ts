import {Map as MaplibreMap} from 'maplibre-gl';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

/* constants */
const MAP_CURSOR_STYLE_EVENT_DEBOUNCE_TIME = 10;

export class MapCursorStyleEvent {

  private subject = new Subject<boolean>();
  private subscription: Subscription;

  constructor(private mapInstance: MaplibreMap, private layerIds: string[]) {
    if (!this.layerIds.length) {
      return;
    }

    this.subscription = this.subject.pipe(
      debounceTime(MAP_CURSOR_STYLE_EVENT_DEBOUNCE_TIME)
    ).subscribe(hover => this.setCursorStyle(hover));

    this.attachEvent();
  }

  complete(): void {
    this.subject.complete();
    this.subscription?.unsubscribe();
  }

  private attachEvent() {
    this.layerIds.forEach(layerId => {
      this.mapInstance.on('mouseenter', layerId, () => this.subject.next(true));
      this.mapInstance.on('mouseleave', layerId, () => this.subject.next(false));
    });
  }

  private setCursorStyle(hover: boolean): void {
    this.mapInstance.getCanvas().style.cursor = hover ? 'pointer' : '';
  }
}
