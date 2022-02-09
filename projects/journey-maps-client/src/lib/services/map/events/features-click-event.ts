import {FeaturesClickEventData} from '../../../journey-maps-client.interfaces';
import {Map as MaplibreMap, MapLayerMouseEvent} from 'maplibre-gl';
import {ReplaySubject, Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MapEventUtils} from './map-event-utils';

const REPEAT_EVENTS = 1;
const MAP_CLICK_EVENT_DEBOUNCE_TIME = 200;

export class FeaturesClickEvent extends ReplaySubject<FeaturesClickEventData> {

  constructor(private mapInstance: MaplibreMap, private layerIds: string[]) {
    super(REPEAT_EVENTS);
    if (!this.layerIds.length) {
      return;
    }
    this.attachEvent();
  }

  private attachEvent(): void {
    const mapClicked = new Subject<MapLayerMouseEvent>();
    mapClicked
      .pipe(debounceTime(MAP_CLICK_EVENT_DEBOUNCE_TIME))
      .subscribe(e => {
        const features = MapEventUtils.queryFeaturesByLayerIds(this.mapInstance, [e.point.x, e.point.y], this.layerIds);
        if (!features.length) {
          return;
        }

        this.next({
          clickPoint: {x: e.point.x, y: e.point.y},
          clickLngLat: {lng: e.lngLat.lng, lat: e.lngLat.lat},
          features: {...features}
        });
      });
    this.mapInstance.on('click', event => mapClicked.next(event));
  }
}
