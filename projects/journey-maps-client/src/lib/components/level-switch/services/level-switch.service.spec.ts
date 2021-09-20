import {TestBed} from '@angular/core/testing';

import {MapLayerFilterService} from './map-layer-filter.service';
import {LevelSwitchService} from './level-switch.service';
import {MapLeitPoiService} from '../../../services/map/map-leit-poi.service';
import {Subject} from 'rxjs';

describe('LevelSwitchService', () => {
  let levelSwitchService: LevelSwitchService;
  let mapLayerFilterServiceSpy: jasmine.SpyObj<MapLayerFilterService>;
  let mapLeitPoiServiceSpy: jasmine.SpyObj<MapLeitPoiService>;
  let mapMock: any;
  let onZoomChangedCallbackFn: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        LevelSwitchService,
        {provide: MapLayerFilterService, useValue: jasmine.createSpyObj('MapLayerFilterService', ['setLevelFilter', 'setMap']
          )},
        { provide: MapLeitPoiService, useValue: jasmine.createSpyObj(
          'MapLeitPoiService',
            ['setCurrentLevel'],
            {levelSwitched: new Subject<number>()}
          )},
      ]
    });

    levelSwitchService = TestBed.inject(LevelSwitchService);
    mapLayerFilterServiceSpy = TestBed.inject(MapLayerFilterService) as jasmine.SpyObj<MapLayerFilterService>;
    mapLeitPoiServiceSpy = TestBed.inject(MapLeitPoiService) as jasmine.SpyObj<MapLeitPoiService>;
  });

  it('should create with default level == 0', () => {
    expect(levelSwitchService.selectedLevel).toEqual(0);
  });

  it('should  set new level on switchLevel', () => {
    const newLevel = -4;
    levelSwitchService.switchLevel(newLevel);
    expect(levelSwitchService.selectedLevel).toEqual(newLevel);
  });

  it('should call service.setLevelFilter with new level value on switchLevel', () => {
    const newLevel = -4;
    levelSwitchService.switchLevel(newLevel);
  });

  it('should not be visible if map not ready', () => {
    expect(levelSwitchService.isVisible()).toEqual(false);
  });

  it('should not be visible if map ready and beyond configured map zoom but no levels', () => {
    levelSwitchService.setAvailableLevels([]);
    triggerOnInitWithMapMock();
    expect(levelSwitchService.isVisible()).toEqual(false);
  });

  it('should be visible if map ready and beyond configured map zoom and levels', () => {
    levelSwitchService.setAvailableLevels([-1, 0]);
    triggerOnInitWithMapMock();
    expect(levelSwitchService.isVisible()).toEqual(true);
  });

  it('should not be visible if map ready and below configured map zoom', () => {
    expect(levelSwitchService.isVisible()).toEqual(false);
  });

  it('should change visibility if map zoomed-in and beyond configured map zoom', () => {
    levelSwitchService.setAvailableLevels([1, 2, 3]);
    triggerOnInitWithMapMock(14);
    expect(levelSwitchService.isVisible()).toEqual(false);
    setMapZoomAndTriggerZoomChanged(16);
    expect(levelSwitchService.isVisible()).toEqual(true);
  });

  it('should set default level if map zoomed-out and below configured map zoom', () => {
    // initial zoom
    triggerOnInitWithMapMock();
    levelSwitchService.setAvailableLevels([1, 2, 3]);
    expect(levelSwitchService.isVisible()).toEqual(true);
    // switch to level -2
    levelSwitchService.switchLevel(-2);
    expect(levelSwitchService.selectedLevel).toEqual(-2);

    setMapZoomAndTriggerZoomChanged(14);

    // check visibility and selected level
    expect(levelSwitchService.isVisible()).toEqual(false);
    expect(levelSwitchService.selectedLevel).toEqual(0);
  });

  it('should show visibleLevels', () => {
    let latestVisibleLevels: number[] = null;
    levelSwitchService.visibleLevels$.subscribe(visibleLevels => latestVisibleLevels = visibleLevels);

    // start with some visibleLevels
    triggerOnInitWithMapMock(15.5);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(latestVisibleLevels.length).toBe(3);
  });

  it('should not show visibleLevels as empty if zoomLevel goes below 15', () => {
    let latestVisibleLevels: number[] = null;
    levelSwitchService.visibleLevels$.subscribe(visibleLevels => latestVisibleLevels = visibleLevels);

    // start with some visibleLevels
    triggerOnInitWithMapMock(15.5);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(latestVisibleLevels.length).toBe(3);

    setMapZoomAndTriggerZoomChanged(14.5);

    expect(latestVisibleLevels.length).toBe(0);
  });

  it('should not show visibleLevels as empty if nb levels goes to 0', () => {
    let latestVisibleLevels: number[] = null;
    levelSwitchService.visibleLevels$.subscribe(visibleLevels => latestVisibleLevels = visibleLevels);

    // start with some visibleLevels
    triggerOnInitWithMapMock(15.5);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(latestVisibleLevels.length).toBe(3);

    levelSwitchService.setAvailableLevels([]);

    expect(latestVisibleLevels.length).toBe(0);
  });

  it('should not show visibleLevels', () => {
    let latestVisibleLevels: number[] = null;
    levelSwitchService.visibleLevels$.subscribe(visibleLevels => latestVisibleLevels = visibleLevels);

    // start with some visibleLevels
    triggerOnInitWithMapMock(14);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(latestVisibleLevels.length).toBe(0);
  });

  it('should show visibleLevels if zoom level goes above 15', () => {
    let latestVisibleLevels: number[] = null;
    levelSwitchService.visibleLevels$.subscribe(visibleLevels => latestVisibleLevels = visibleLevels);

    // start with some visibleLevels
    triggerOnInitWithMapMock(14);
    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(latestVisibleLevels.length).toBe(0);

    setMapZoomAndTriggerZoomChanged(15.5);

    expect(latestVisibleLevels.length).toBe(3);
  });

  it('should show visibleLevels if number of level goes above 0', () => {
    let latestVisibleLevels: number[] = null;
    levelSwitchService.visibleLevels$.subscribe(visibleLevels => latestVisibleLevels = visibleLevels);

    // start with some visibleLevels
    triggerOnInitWithMapMock(16);
    levelSwitchService.setAvailableLevels([]);

    expect(latestVisibleLevels.length).toBe(0);

    levelSwitchService.setAvailableLevels([1, 2, 3]);

    expect(latestVisibleLevels.length).toBe(3);
  });

  function triggerOnInitWithMapMock(initialMapZoom?: number): any {
    mapMock = {
      getStyle: () => {
        return {
          layers: []
        };
      },
      on: (eventName: string, callbackFn: any) => {
        if (eventName === 'zoomend') {
          onZoomChangedCallbackFn = callbackFn;
        }
      },
      isSourceLoaded: () => false,
      once: () => undefined
    };
    setMapZoom(initialMapZoom ?? 15);

    // @ts-ignore
    levelSwitchService.onInit(mapMock);
  }

  function setMapZoom(mapZoom: number): void {
    mapMock.getZoom = () => {
      return mapZoom;
    };
  }

  function setMapZoomAndTriggerZoomChanged(mapZoom: number): void {
    setMapZoom(mapZoom);
    onZoomChangedCallbackFn();
  }
});
