import {FeatureEventData, FeaturesHoverChangeEventData} from '../../../journey-maps-client.interfaces';
import {LngLat, Map as MaplibreMap, Point} from 'maplibre-gl';
import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MapEventUtils} from './map-event-utils';

const REPEAT_EVENTS = 1;
const MAP_MOVE_EVENT_DEBOUNCE_TIME = 25;

interface MouseMovedEventData {
  mapEvent: MapEventData,
  hover: boolean,
  hoverState: MouseHoverState
}

interface MapEventData {
  point: Point,
  lngLat: LngLat
}

interface MouseHoverState {
  hoveredFeatures: FeatureEventData[];
}

export class FeaturesHoverEvent extends ReplaySubject<FeaturesHoverChangeEventData> {

  private subscription: Subscription;

  constructor(private mapInstance: MaplibreMap, private layerIds: string[]) {
    super(REPEAT_EVENTS);
    if (!this.layerIds.length) {
      return;
    }
    this.attachEvent();
  }


  complete() {
    super.complete();
    this.subscription?.unsubscribe();
  }

  private attachEvent(): void {
    const mouseMovedSubject = this.getMouseMovedSubject();
    const hoverState: MouseHoverState = {hoveredFeatures: []};
    this.mapInstance.on('mousemove', mapEvent => {
      mouseMovedSubject.next({
        mapEvent: this.eventToMapEventData(mapEvent),
        hover: true,
        hoverState
      });
    });
  }

  private getMouseMovedSubject(): Subject<MouseMovedEventData> {
    const mouseMovedSubject = new Subject<MouseMovedEventData>();
    this.subscription = mouseMovedSubject.pipe(
      debounceTime(MAP_MOVE_EVENT_DEBOUNCE_TIME),
    ).subscribe(eventData => {
      // FIXME: beim click und doppel-click passiert nichts :-(
      this.onHoverChanged(eventData);
    });
    return mouseMovedSubject;
  }

  private onHoverChanged(eventData: MouseMovedEventData) {
    const event = eventData.mapEvent;
    const hover = eventData.hover;
    const state = eventData.hoverState;

    const eventPoint = {x: event.point.x, y: event.point.y};
    const eventLngLat = {lng: event.lngLat.lng, lat: event.lngLat.lat};

    if (hover) {
      // FIXME: check if changed based on feature ids
      const currentFeatures: FeatureEventData[] =
        MapEventUtils.queryFeaturesByLayerIds(this.mapInstance, [eventPoint.x, eventPoint.y], this.layerIds);

      if (state.hoveredFeatures.length) {
        this.next(this.eventToHoverChangeEventData(eventPoint, eventLngLat, state.hoveredFeatures, false));
      }
      if (currentFeatures?.length) {
        this.next(this.eventToHoverChangeEventData(eventPoint, eventLngLat, currentFeatures, true));
      }
      state.hoveredFeatures = currentFeatures ?? [];
    } else if (state.hoveredFeatures.length) {
      // leave
      this.next(this.eventToHoverChangeEventData(eventPoint, eventLngLat, state.hoveredFeatures, false));
      state.hoveredFeatures = [];
    }
  }

  private eventToMapEventData(mapEvent): MapEventData {
    return {
      point: mapEvent.point,
      lngLat: mapEvent.lngLat
    };
  }

  private eventToHoverChangeEventData(
    eventPoint: { x: number; y: number },
    eventLngLat: { lng: number; lat: number },
    features: FeatureEventData[],
    hover: boolean
  ): FeaturesHoverChangeEventData {
    const leave = !hover;
    return {
      eventPoint,
      eventLngLat,
      hover,
      leave,
      features: [...features]
    };
  }
}
