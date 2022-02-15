import {FeatureDataType, FeaturesClickEventData} from '../../../journey-maps-client.interfaces';
import {Map as MaplibreMap, MapLayerMouseEvent} from 'maplibre-gl';
import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MapEventUtils} from './map-event-utils';

const REPEAT_EVENTS = 1;
const MAP_CLICK_EVENT_DEBOUNCE_TIME = 200;

export class FeaturesClickEvent extends ReplaySubject<FeaturesClickEventData> {

  private subscription: Subscription;

  constructor(private mapInstance: MaplibreMap, private layers: Map<string, FeatureDataType>) {
    super(REPEAT_EVENTS);
    if (!this.layers.size) {
      return;
    }
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
        const features = MapEventUtils.queryFeaturesByLayerIds(this.mapInstance, [e.point.x, e.point.y], this.layers);
        if (!features.length) {
          return;
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
