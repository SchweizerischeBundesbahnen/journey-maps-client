import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {InfoBoxComponent} from './components/info-box/info-box.component';
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

  it('should emit selectedMarkerId when selecting a marker', async () => {
    const { fixture, outputs, bindings } = await shallow
      .mock(MapInitService, {
        initializeMap: () => of({
          isStyleLoaded: () => false,
          on: () => {},
          addControl: () => {},
        } as unknown as mapboxgl.Map)
      }).mock(MapService, {
        selectMarker: () => {},
        onMapLoaded: () => {},
        unselectFeature: () => {},
      })
      .render({
        bind: {
          language: 'en',
          apiKey: 'e500c71b8c83c1cfb2170608582ae9c8',
          markers,
          selectedMarkerId: undefined,
        }
      });

    (outputs.selectedMarkerIdChange.emit as jasmine.Spy).calls.reset();

    bindings.selectedMarkerId = 'work';
    fixture.detectChanges();

    expect(outputs.selectedMarkerIdChange.emit).toHaveBeenCalledTimes(1);
    expect(outputs.selectedMarkerIdChange.emit).toHaveBeenCalledWith('work');

    (outputs.selectedMarkerIdChange.emit as jasmine.Spy).calls.reset();

    bindings.selectedMarkerId = undefined;
    fixture.detectChanges();

    expect(outputs.selectedMarkerIdChange.emit).toHaveBeenCalledTimes(1);
    expect(outputs.selectedMarkerIdChange.emit).toHaveBeenCalledWith(undefined);
  });
});

describe('JourneyMapsClientComponent', () => {
  let component: JourneyMapsClientComponent;
  let fixture: ComponentFixture<JourneyMapsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        JourneyMapsClientComponent,
        InfoBoxComponent
      ],
      providers: [Window]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyMapsClientComponent);
    component = fixture.componentInstance;
    component.apiKey = 'apiKey';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
