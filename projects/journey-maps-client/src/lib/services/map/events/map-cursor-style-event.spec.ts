import {MaplibreMapMock} from '../../../model/maplibre-map-mock';
import {MapCursorStyleEvent} from './map-cursor-style-event';

describe('MapCursorStyleEvent', () => {
  let mapCursorStyleEvent: MapCursorStyleEvent;
  let mapMock: MaplibreMapMock;

  beforeEach(() => {
    mapMock = new MaplibreMapMock();
    const layers = ['layer-1', 'layer-2'];
    mapCursorStyleEvent = new MapCursorStyleEvent(mapMock.get(), layers);
  });

  it('should be created', () => {
    expect(mapCursorStyleEvent).toBeTruthy();
  });
});
