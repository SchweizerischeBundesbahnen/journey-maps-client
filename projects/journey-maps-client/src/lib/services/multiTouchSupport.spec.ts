import {MultiTouchSupport} from './multiTouchSupport';

describe('MultiTouchSupport', () => {
  let service: MultiTouchSupport;
  let map: any;

  const initialZoom = 11;

  beforeEach(() => {
    service = new MultiTouchSupport();
    map = {
      panBy: jasmine.createSpy(),
      setZoom: jasmine.createSpy(),
      getZoom: () => initialZoom,
      getContainer: () => ({
        addEventListener: () => {},
      }),
    };
    service.onAdd(map);
  });

  const expectPanByToHaveBeenCalledWithNearly = ([expectedX, expectedY]) => {
    const panByArgs = map.panBy.calls.mostRecent().args;
    const coordinates = panByArgs[0];
    const actualX = coordinates[0];
    const actualY = coordinates[1];
    const actualOptions = panByArgs[1];
    expect(actualX).toBeCloseTo(expectedX, 2);
    expect(actualY).toBeCloseTo(expectedY, 2);
    expect(actualOptions).toEqual(jasmine.anything());
  };

  const expectSetZoomToHaveBeenCalledWithNearly = (expectedZoomLevel, precision = 2) => {
    const setZoomArg = map.setZoom.calls.mostRecent().args[0];
    expect(setZoomArg).toBeCloseTo(expectedZoomLevel, precision);
  };

  it('pans correctly', () => {
    // given
    const startEvent = {touches: [{screenX: 2, screenY: 2}, {screenX: 3, screenY: 3}]};
    const moveEvent = {touches: [{screenX: 2.01, screenY: 1.99}, {screenX: 3.01, screenY: 2.99}]};

    // when
    service.touchStart(startEvent);
    service.touchMove(moveEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.01, 0.01]);
    expect(map.setZoom).toHaveBeenCalledOnceWith(initialZoom);
  });

  it('zooms correctly', () => {
    // given
    const startEvent = {touches: [{screenX: 2, screenY: 2}, {screenX: 3, screenY: 3}]};
    const moveEvent = {touches: [{screenX: 1.99, screenY: 1.99}, {screenX: 3.01, screenY: 3.01}]};

    // when
    service.touchStart(startEvent);
    service.touchMove(moveEvent);

    // then
    expect(map.panBy).toHaveBeenCalledOnceWith([-0, -0], jasmine.anything());
    expectSetZoomToHaveBeenCalledWithNearly(11.132, 3);
  });

  it('pans and zooms correctly', () => {
    // given
    const startEvent = {touches: [{screenX: 2, screenY: 2}, {screenX: 3, screenY: 3}]};
    const moveEvent = {touches: [{screenX: 2.01, screenY: 2.01}, {screenX: 3.03, screenY: 3.03}]};

    // when
    service.touchStart(startEvent);
    service.touchMove(moveEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.02, -0.02]); // the average of finger 1 and finger 2 moves
    expectSetZoomToHaveBeenCalledWithNearly(11.132, 3);
  });
});
