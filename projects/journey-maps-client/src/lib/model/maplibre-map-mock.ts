import {Map as MapLibreMap} from 'maplibre-gl';

interface EventInfo {
  _layerId: string,
  callbackFn: any
}

export class MaplibreMapMock {

  private readonly callbackFnCache = new Map<String, EventInfo[] | any[]>();

  /**
   Provide on-function mock. Keeps callback functions in a list.
   Use raise(eventName) to simulate an event.
   * */
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
