import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {Shallow} from 'shallow-render';
import {JourneyMapsClientModule} from './journey-maps-client.module';
import {Marker} from './model/marker';
import {TextInfoBlock} from './model/infoblock/text-info-block';
import {ButtonInfoBlock} from './model/infoblock/button-info-block';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MapInitService} from './services/map-init.service';
import {of} from 'rxjs';
import {MapService} from './services/map.service';

describe('JourneyMapsClientComponent shallow-render', () => {
  let shallow: Shallow<JourneyMapsClientComponent>;

  beforeEach(() => {
    shallow = new Shallow(JourneyMapsClientComponent, JourneyMapsClientModule)
      .replaceModule(BrowserAnimationsModule, NoopAnimationsModule);
  });

  const shallowRender = async (selectedMarkerId: string): Promise<any> => {
    return await shallow
      .mock(MapInitService, {
        initializeMap: () => of({
          isStyleLoaded: () => false,
          on: () => {},
          addControl: () => {},
        } as unknown as mapboxgl.Map),
      }).mock(MapService, {
        selectMarker: () => {},
        onMapLoaded: () => {},
        unselectFeature: () => {},
      })
      .render({
        bind: {
          apiKey: 'e500c71b8c83c1cfb2170608582ae9c8',
          markers,
          selectedMarkerId,
        },
      });
  };

  const resetSpyCalls = (emit: jasmine.Spy) => {
    emit.calls.reset();
  };

  it('should emit selectedMarkerId when (un-)selecting a marker', async () => {
    const { fixture, outputs, bindings } = await shallowRender(undefined);

    const emit = outputs.selectedMarkerIdChange.emit;

    function setSelectedMarkerId(markerId: string): void {
      bindings.selectedMarkerId = markerId;
      fixture.detectChanges();
    }

    // change from 'undefined' to 'work'
    resetSpyCalls(emit);
    setSelectedMarkerId('work');

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith('work');

    // change from 'work' to 'undefined'
    resetSpyCalls(emit);
    setSelectedMarkerId(undefined);

    expect(emit).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledWith(undefined);
  });
});

const markers: Marker[] = [
  {
    id: 'home',
    title: 'Home Office',
    subtitle: 'My home is my castle',
    position: [7.296515, 47.069815],
    category: 'INFORMATION', // or MISSED_CONNECTION or CUSTOM
    infoBlocks: [
      {
        type: 'TEXT',
        title: 'Lorem Ipsum',
        content: 'Lorem ipsum dolor sit amet, consectetur adipisici elit'
      } as TextInfoBlock,
      {
        type: 'BUTTON',
        title: 'Bavaria Ipsum',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      } as ButtonInfoBlock,
    ]
  },
  {
    id: 'work',
    title: 'Office',
    subtitle: 'SBB Wylerpark',
    position: [7.446450, 46.961409],
    category: 'MISSED_CONNECTION',
    infoBlocks: [
      {
        type: 'BUTTON',
        title: 'Show menu plan',
        url: 'https://zfv.ch/en/microsites/sbb-restaurant-wylerpark/menu-plan'
      } as ButtonInfoBlock,
    ]
  },
];
