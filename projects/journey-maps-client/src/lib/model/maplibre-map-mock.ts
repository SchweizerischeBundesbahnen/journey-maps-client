import {Map as MapLibreMap} from 'maplibre-gl';

export class MaplibreMapMock {

  private readonly callbackFnCache = new Map<String, any[]>();

  /**
   Provide on-function mock. Keeps callback functions in a list.
   Use raise(eventName) to simulate an event.
   * */
  on(eventName: string, callbackFn) {
    let callbackList = this.callbackFnCache.get(eventName);
    if (!callbackList) {
      this.callbackFnCache.set(eventName, []);
      callbackList = this.callbackFnCache.get(eventName);
    }
    callbackList.push(callbackFn);
  }

  raise(eventName: string) {
    let callbackList = this.callbackFnCache.get(eventName);
    if (!callbackList) {
      throw new Error(`Event ${eventName} was not registered.`);
    }
    for (let callback of callbackList) {
      MaplibreMapMock.callbackWithEventArgs(eventName, callback);
    }
  }

  get(): MapLibreMap {
    return this as unknown as MapLibreMap;
  }

  private static callbackWithEventArgs(eventName: string, callback: any) {
    switch (eventName) {
      case 'click': {
        callback({
          point: {x: 150, y: 100},
          lngLat: {lng: 7.265078, lat: 46.565312}
        });
        break;
      }
      default:
        callback();
        break;
    }
  }
}
