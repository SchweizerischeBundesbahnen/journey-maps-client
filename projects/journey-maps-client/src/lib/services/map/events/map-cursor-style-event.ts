import {Map as MaplibreMap, MapMouseEvent, Point} from 'maplibre-gl';
import {Subject, Subscription} from 'rxjs';
import {sampleTime} from 'rxjs/operators';

const CURSOR_STYLE_DELAY = 25;

export class MapCursorStyleEvent {

  private subject = new Subject<Point>();
  private subscription: Subscription;
  private mouseEventListener: (event: MapMouseEvent) => void;

  constructor(
    private mapInstance: MaplibreMap,
    private layerIds: string[]
  ) {
    if (!this.layerIds.length) {
      return;
    }

    this.subscription = this.subject.pipe(sampleTime(CURSOR_STYLE_DELAY)).subscribe(point => this.updateCursorStyle(point));

    this.mouseEventListener = (e: MapMouseEvent) => this.subject.next(new Point(e.point.x, e.point.y));

    this.layerIds.forEach(layerId => {
      this.mapInstance.on('mouseenter', layerId, this.mouseEventListener);
      this.mapInstance.on('mouseleave', layerId, this.mouseEventListener);
    });
  }

  complete(): void {
    this.subject.complete();
    this.subscription?.unsubscribe();

    this.layerIds.forEach(layerId => {
      this.mapInstance.off('mouseenter', layerId, this.mouseEventListener);
      this.mapInstance.off('mouseleave', layerId, this.mouseEventListener);
    });
  }

  private updateCursorStyle(point: Point): void {
    const features = this.mapInstance.queryRenderedFeatures(point, {layers: this.layerIds});
    const hover = features?.length;

    this.mapInstance.getCanvas().style.cursor = hover ? 'pointer' : '';
  }
}
