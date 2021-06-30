import {TestBed} from '@angular/core/testing';

import {LevelSwitchComponent} from './level-switch.component';
import {MapLayerFilterService} from './services/map-layer-filter.service';
import {ChangeDetectorRef, SimpleChange} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('LevelSwitchComponent', () => {
  let component: LevelSwitchComponent;
  let serviceSpy: jasmine.SpyObj<MapLayerFilterService>;
  let mapMock: any;
  let onZoomChangedCallbackFn: any;

  beforeEach(async () => {

    const serviceSpyObj = jasmine.createSpyObj('MapLayerFilterService', ['setLevelFilter', 'setMap']);

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule],
      declarations: [LevelSwitchComponent],
      providers: [
        {provide: MapLayerFilterService, useValue: serviceSpyObj},
        ChangeDetectorRef
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(LevelSwitchComponent);
    // MapLayerFilterService actually injected into the component
    serviceSpy = fixture.debugElement.injector.get(MapLayerFilterService) as jasmine.SpyObj<MapLayerFilterService>;

    // get instance for testing
    component = fixture.componentInstance;
    // trigger initial data binding
    fixture.detectChanges();
  });

  it('should create with default level == 0', () => {
    expect(component.selectedLevel).toEqual(0);
  });

  it('should  set new level on switchLevel', () => {
    const newLevel = -4;
    triggerMapReadyWithMapMock(component, 8);
    component.switchLevel(newLevel);
    expect(component.selectedLevel).toEqual(newLevel);
  });

  it('should call service.setLevelFilter with new level value on switchLevel', () => {
    const newLevel = -4;
    triggerMapReadyWithMapMock(component, 8);
    component.switchLevel(newLevel);
    expect(serviceSpy.setLevelFilter).toHaveBeenCalledWith(newLevel);
  });

  it('should not be visible if map not ready', () => {
    expect(component.isVisible).toEqual(false);
  });

  it('should not be visible if map ready and beyond configured map zoom but no levels', () => {
    triggerMapReadyWithMapMock(component, 16);
    component.levels = [];
    expect(component.isVisible).toEqual(false);
  });

  it('should be visible if map ready and beyond configured map zoom and levels', () => {
    triggerMapReadyWithMapMock(component, 16);
    component.levels = [-1, 0];
    expect(component.isVisible).toEqual(true);
  });

  it('should not be visible if map ready and below configured map zoom', () => {
    triggerMapReadyWithMapMock(component, 14);
    expect(component.isVisible).toEqual(false);
  });

  it('should change visibility if map zoomed-in and beyond configured map zoom', () => {
    triggerMapReadyWithMapMock(component, 14);
    expect(component.isVisible).toEqual(false);
    mapMock.getZoom = () => {
      return 16;
    };
    onZoomChangedCallbackFn();
    expect(component.isVisible).toEqual(true);
  });

  it('should set default level if map zoomed-out and below configured map zoom', () => {
    // initial zoom
    triggerMapReadyWithMapMock(component, 16);
    expect(component.isVisible).toEqual(true);
    // switch to level -2
    component.switchLevel(-2);
    expect(component.selectedLevel).toEqual(-2);

    setMapZoom(14);

    // zoom callback
    onZoomChangedCallbackFn();

    // check visibility and selected level
    expect(component.isVisible).toEqual(false);
    expect(component.selectedLevel).toEqual(0);
  });

  function triggerMapReadyWithMapMock(levelSwitchComponent: LevelSwitchComponent, initialMapZoom: number): any {
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
    };

    setMapZoom(initialMapZoom);

    levelSwitchComponent.map = mapMock;
    // ngOnChanges is not called when setting @Input programmatically
    levelSwitchComponent.ngOnChanges({map: new SimpleChange(undefined, mapMock, true)});
    expect(serviceSpy.setMap).toHaveBeenCalledWith(mapMock);
  }

  function setMapZoom(mapZoom: number): void {
    mapMock.getZoom = () => {
      return mapZoom;
    };
  }
});
