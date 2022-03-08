import {Map as MapLibreMap, MapboxGeoJSONFeature, Point, PointLike} from 'maplibre-gl';

interface EventInfo {
  _layerId: string,
  callbackFn: any
}

export class MaplibreMapMock {
  static readonly EVENT_POINT: Point = new Point(150, 100);

  private readonly callbackFnCache = new Map<String, EventInfo[] | any[]>();
  private readonly canvasStyle = {style: {cursor: ''}};

  private readonly featureData = new Map<string, { layers: string[], features: MapboxGeoJSONFeature[] }>();

  get(): MapLibreMap {
    return this as unknown as MapLibreMap;
  }

  /* Public MaplibreMap functions */

  /**
   * on-function mock. Use raise(eventName) to simulate an event.
   */
  on(eventName, ...args) {
    let callbackList = this.callbackFnCache.get(eventName);
    if (!callbackList) {
      this.callbackFnCache.set(eventName, []);
      callbackList = this.callbackFnCache.get(eventName);
    }

    if (args.length > 1) {
      // layerId and
      callbackList.push({_layerId: args[0], callbackFn: args[1]});
    } else {
      callbackList.push(args[0]);
    }
  }

  off(eventName, ...args) {
    let callbackList = this.callbackFnCache.get(eventName);
    if (!callbackList) {
      return;
    }

    let idx: number;
    if (args.length > 1) {
      // layerId and
      idx = callbackList.findIndex(item => item._layerId === args[0] && item.callbackFn === args[1]);
    } else {
      idx = callbackList.findIndex(item => item === args[0]);
    }

    if (idx >= 0) {
      callbackList.splice(idx, 1);
    }
  }

  getCanvas = () => this.canvasStyle;

  getFeatureState = () => new Object();

  setFeatureState = () => void (0);

  queryRenderedFeatures(point: PointLike, options?: { layers?: string[] }): MapboxGeoJSONFeature[] {
    const data = this.featureData.get(MaplibreMapMock.stringify(point));
    if (data && (!options?.layers?.length || data.layers.some(l => options.layers.includes(l)))) {
      return data.features;
    }

    return null;
  }

  /* End of any Public MaplibreMap functions */

  raise(eventName: string) {
    let callbackList = this.callbackFnCache.get(eventName);
    if (!callbackList) {
      throw new Error(`Event ${eventName} was not registered.`);
    }
    for (let callback of callbackList) {
      if (callback._layerId) {
        const info = callback as EventInfo;
        MaplibreMapMock.callbackWithEventArgs(eventName, info.callbackFn);
      } else {
        MaplibreMapMock.callbackWithEventArgs(eventName, callback);
      }
    }
  }

  addFeatureData(point: PointLike, layers: string[], features: MapboxGeoJSONFeature[]) {
    this.featureData.set(MaplibreMapMock.stringify(point), {layers, features});
  }

  private static callbackWithEventArgs(eventName: string, callback: any) {
    switch (eventName) {
      case 'mousemove':
      case 'mouseenter':
      case 'mouseleave':
      case 'click': {
        callback({
          point: MaplibreMapMock.EVENT_POINT,
          lngLat: {lng: 7.265078, lat: 46.565312}
        });
        break;
      }
      default:
        callback();
        break;
    }
  }

  private static stringify(point: PointLike): string {
    return Array.isArray(point) ? JSON.stringify(point) : JSON.stringify([point.x, point.y]);
  }

}
