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

  const expectPanByToHaveBeenCalledWithNearly = ([expectedX, expectedY], precision, options = {}) => {
    const panByArgs = map.panBy.calls.mostRecent().args;
    const coordinates = panByArgs[0];
    const actualX = coordinates[0];
    const actualY = coordinates[1];
    const actualOptions = panByArgs[1];
    expect(actualX).toBeCloseTo(expectedX, precision);
    expect(actualY).toBeCloseTo(expectedY, precision);
    expect(actualOptions).toEqual({animate: false, ...options});
  };

  const expectSetZoomToHaveBeenCalledWithNearly = (expectedZoomLevel, precision) => {
    expect(map.setZoom.calls.mostRecent().args[0]).toBeCloseTo(expectedZoomLevel, precision);
  };

  it('pans correctly', () => {
    // given
    const startEvent = {touches: [{screenX: 2, screenY: 2}, {screenX: 3, screenY: 3}]};
    const moveEvent = {touches: [{screenX: 2.01, screenY: 1.99}, {screenX: 3.01, screenY: 2.99}]};

    // when
    service.touchStart(startEvent);
    service.touchMove(moveEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.01, 0.01], 2);
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
    expectPanByToHaveBeenCalledWithNearly([-0.02, -0.02], 2); // the average of finger 1 and finger 2 moves
    expectSetZoomToHaveBeenCalledWithNearly(11.132, 3);
  });

  it('pans and zooms correctly in multiple steps', () => {
    // given
    const startEvent = {touches: [{screenX: 2, screenY: 2}, {screenX: 3, screenY: 3}]};
    const moveEvent1 = {touches: [{screenX: 2.01, screenY: 2.01}, {screenX: 3.01, screenY: 3.01}]};
    const moveEvent2 = {touches: [{screenX: 1.99, screenY: 1.99}, {screenX: 3.01, screenY: 3.01}]};

    // when
    service.touchStart(startEvent);
    service.touchMove(moveEvent1);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.01, -0.01], 2);
    expect(map.setZoom).toHaveBeenCalledOnceWith(initialZoom);

    // when
    service.touchMove(moveEvent2);

    // then
    expectPanByToHaveBeenCalledWithNearly([0.01, 0.01], 2); // the average of finger 1 and finger 2 moves
    expectSetZoomToHaveBeenCalledWithNearly(11.132, 3);
  });

  it('doesn\'t pan or zoom if fingers only rotate', () => {
    // given
    const startEvent = {touches: [{screenX: 2.00, screenY: 2.00}, {screenX: 3.00, screenY: 3.00}]};
    const moveEvent = {touches: [{screenX: 1.99, screenY: 2.01}, {screenX: 3.01, screenY: 2.99}]};

    // when
    service.touchStart(startEvent);
    service.touchMove(moveEvent);

    // then
    expect(map.panBy).toHaveBeenCalledOnceWith([-0, -0], jasmine.anything());
    expect(map.setZoom).toHaveBeenCalledOnceWith(initialZoom);
  });

  it('DOESN\'T zoom beneath the TOUCH_ZOOM_THRESHOLD', () => {
    // given
    const startEvent = {touches: [{screenX: 2, screenY: 2}, {screenX: 3, screenY: 3}]};
    const moveEvent = {touches: [{screenX: 2.02, screenY: 2.02}, {screenX: 3.03, screenY: 3.03}]};

    // when
    service.touchStart(startEvent);
    service.touchMove(moveEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.025, -0.025], 3); // the average of finger 1 and finger 2 moves
    expect(map.setZoom).toHaveBeenCalledOnceWith(initialZoom);
  });

  it('DOES zoom above the TOUCH_ZOOM_THRESHOLD', () => {
    // given
    const startEvent = {touches: [{screenX: 2, screenY: 2}, {screenX: 3, screenY: 3}]};
    const moveEvent = {touches: [{screenX: 2.02, screenY: 2.02}, {screenX: 3.031, screenY: 3.031}]};

    // when
    service.touchStart(startEvent);
    service.touchMove(moveEvent);

    // then
    expectPanByToHaveBeenCalledWithNearly([-0.0255, -0.0255], 4); // the average of finger 1 and finger 2 moves
    expectSetZoomToHaveBeenCalledWithNearly(11.0726, 4);
  });
});
