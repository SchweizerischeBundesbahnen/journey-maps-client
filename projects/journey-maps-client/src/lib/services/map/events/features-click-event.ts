import {FeatureDataType, FeaturesClickEventData} from '../../../journey-maps-client.interfaces';
import {Map as MaplibreMap, MapLayerMouseEvent} from 'maplibre-gl';
import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MapEventUtilsService} from './map-event-utils.service';

const REPEAT_EVENTS = 1;
const MAP_CLICK_EVENT_DEBOUNCE_TIME = 200;

export class FeaturesClickEvent extends ReplaySubject<FeaturesClickEventData> {

  private subscription: Subscription;

  constructor(
    private mapInstance: MaplibreMap,
    private mapEventUtils: MapEventUtilsService,
    private layers: Map<string, FeatureDataType>
  ) {
    super(REPEAT_EVENTS);
    this.attachEvent();
  }

  complete() {
    super.complete();
    this.subscription?.unsubscribe();
  }

  private attachEvent(): void {
    const mapClicked = new Subject<MapLayerMouseEvent>();
    this.subscription = mapClicked.pipe(debounceTime(MAP_CLICK_EVENT_DEBOUNCE_TIME))
      .subscribe(e => {
        let features = this.mapEventUtils.queryFeaturesByLayerIds(this.mapInstance, [e.point.x, e.point.y], this.layers);
        if (!features.length) {
          return;
        }

        // Click priority: points, lines/multiline, polygons/others
        const points = features.filter(f => f.geometry.type.includes('Point'));
        const lines = features.filter(f => f.geometry.type.includes('Line'));
        if (points.length) {
          features = points;
        } else if (lines.length) {
          features = lines;
        }

        this.next({
          clickPoint: {x: e.point.x, y: e.point.y},
          clickLngLat: {lng: e.lngLat.lng, lat: e.lngLat.lat},
          features: [...features]
        });
      });
    this.mapInstance.on('click', event => mapClicked.next(event));
  }
}
