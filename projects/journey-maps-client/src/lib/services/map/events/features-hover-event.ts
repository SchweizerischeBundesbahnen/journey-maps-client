import {FeatureEventData, FeaturesHoverChangeEventData} from '../../../journey-maps-client.interfaces';
import {LngLat, Map as MaplibreMap, MapboxGeoJSONFeature, Point} from 'maplibre-gl';
import {ReplaySubject, Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {MapEventUtils} from './map-event-utils';

const REPEAT_EVENTS = 1;
const MAP_MOVE_EVENT_DEBOUNCE_TIME = 25;

interface MouseMovedEventData {
  mapEvent: MapEventData,
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

  beforeHoverEvent = new Subject<FeaturesHoverChangeEventData>();

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
    const state = eventData.hoverState;

    const eventPoint = {x: event.point.x, y: event.point.y};
    const eventLngLat = {lng: event.lngLat.lng, lat: event.lngLat.lat};

    let currentFeatures: FeatureEventData[] =
      MapEventUtils.queryFeaturesByLayerIds(this.mapInstance, [eventPoint.x, eventPoint.y], this.layerIds);
    let hasNewFeatures = !!currentFeatures.length;

    if (state.hoveredFeatures.length) {
      const removeFeatures = state.hoveredFeatures.filter(current => !currentFeatures.find(added => this.featureEventDataEquals(current, added)));
      if (removeFeatures.length) {
        const eventData = this.eventToHoverChangeEventData(eventPoint, eventLngLat, removeFeatures, false);
        this.beforeHoverEvent.next(eventData);
        // leave
        this.setFeatureState(eventData.features, false);
        this.next(eventData);
      }
      const newFeatures = currentFeatures.filter(current => !state.hoveredFeatures.find(added => this.featureEventDataEquals(current, added)));
      if (newFeatures.length) {
        currentFeatures = newFeatures;
      } else {
        hasNewFeatures = false;
      }
    }
    if (hasNewFeatures && currentFeatures?.length) {
      const eventData = this.eventToHoverChangeEventData(eventPoint, eventLngLat, currentFeatures, true);
      this.beforeHoverEvent.next(eventData);
      currentFeatures = eventData.features;
      // hover
      this.setFeatureState(currentFeatures, true);
      this.next(eventData);
    }

    state.hoveredFeatures = currentFeatures ?? [];
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

  private featureEventDataEquals(current: FeatureEventData, added: FeatureEventData): boolean {
    return current.layerId === added.layerId &&
      current.sourceId === added.sourceId &&
      current.sourceLayerId === added.sourceLayerId &&
      current.feature.id === added.feature.id;
  }

  private setFeatureState(featureEventData: FeatureEventData[], hover: boolean) {
    featureEventData.forEach(data => {
      const mapFeature: MapboxGeoJSONFeature = {
        layer: this.mapInstance.getLayer(data.layerId),
        source: data.sourceId,
        sourceLayer: data.sourceLayerId,
        ...data.feature
      };
      const state = this.mapInstance.getFeatureState(mapFeature);
      state.hover = hover;
      this.mapInstance.setFeatureState(mapFeature, state);
    });
  }
}
