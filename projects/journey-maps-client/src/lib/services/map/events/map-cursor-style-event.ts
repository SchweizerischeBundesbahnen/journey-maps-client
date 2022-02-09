import {Map as MaplibreMap} from 'maplibre-gl';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

/* constants */
const MAP_CURSOR_STYLE_EVENT_DEBOUNCE_TIME = 10;

export class MapCursorStyleEvent {

  constructor(private mapInstance: MaplibreMap, private layerIds: string[]) {
    if (!this.layerIds.length) {
      return;
    }
    this.attachEvent();
  }

  private attachEvent() {
    const cursorStyleSubject = this.getCursorStyleSubject();
    this.layerIds.forEach(layerId => {
      this.mapInstance.on('mouseenter', layerId, () => cursorStyleSubject.next(true));
      this.mapInstance.on('mouseleave', layerId, () => cursorStyleSubject.next(false));
    });
  }

  private getCursorStyleSubject(): Subject<boolean> {
    const subject = new Subject<boolean>();
    subject.pipe(debounceTime(MAP_CURSOR_STYLE_EVENT_DEBOUNCE_TIME))
      .subscribe(hover => this.setCursorStyle(hover));
    return subject;
  }

  private setCursorStyle(hover: boolean): void {
    this.mapInstance.getCanvas().style.cursor = hover ? 'pointer' : '';
  }
}
