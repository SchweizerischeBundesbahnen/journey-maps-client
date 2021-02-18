import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {Marker} from './model/marker';
import {TextInfoBlock} from './model/infoblock/text-info-block';
import {ButtonInfoBlock} from './model/infoblock/button-info-block';
import {MapService} from './services/map.service';
import {MapInitService} from './services/map-init.service';
import {of} from 'rxjs';
import {JourneyMapsClientModule} from './journey-maps-client.module';

describe('JourneyMapsClientComponent', () => {
  let component: JourneyMapsClientComponent;
  let fixture: ComponentFixture<JourneyMapsClientComponent>;
  let selectedMarkerIdChange;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneyMapsClientModule],
      declarations: [JourneyMapsClientComponent],
      providers: [
        Window,
        {
          provide: MapService,
          useValue: {
            selectMarker: () => {},
            unselectFeature: () => {},
          }
        },
        {
          provide: MapInitService,
          useValue: {
            initializeMap: () => of({
              isStyleLoaded: () => false,
              on: () => {},
              addControl: () => {},
              resize: () => {},
            } as unknown as mapboxgl.Map),
          }
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyMapsClientComponent);
    component = fixture.componentInstance;
    component.apiKey = 'apiKey';
    component.markers = markers;
    fixture.detectChanges();
  });

  it('should emit selectedMarkerId when (un-)selecting a marker', async () => {
    function setSelectedMarkerId(markerId: string): void {
      component.selectedMarkerId = markerId;
      fixture.detectChanges();
    }

    component.selectedMarkerIdChange.subscribe((id: string) => selectedMarkerIdChange = id);

    expect(selectedMarkerIdChange).toBe(undefined);

    setSelectedMarkerId('work');
    expect(selectedMarkerIdChange).toBe('work');

    setSelectedMarkerId(undefined);
    expect(selectedMarkerIdChange).toBe(undefined);
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
