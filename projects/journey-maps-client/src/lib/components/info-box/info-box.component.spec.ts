import {InfoBoxComponent} from './info-box.component';
import {TextInfoBlock} from '../../model/infoblock/text-info-block';
import {TemplateRef} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ButtonInfoBlock} from '../../model/infoblock/button-info-block';
import {By} from '@angular/platform-browser';
import {JourneyMapsClientModule} from '../../journey-maps-client.module';

describe('InfoBoxComponent', () => {
  let component: InfoBoxComponent;
  let fixture: ComponentFixture<InfoBoxComponent>;
  let closeClicked: boolean;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JourneyMapsClientModule],
    });
    fixture = TestBed.createComponent(InfoBoxComponent);
    component = fixture.componentInstance;
    closeClicked = false;
    expect(getCloseButtonDe()).toBeNull();
  });

  const prepareSelectedMarker = () => {
    component.closeClicked.subscribe(() => closeClicked = true);
    component.selectedMarker = createMarkerWithInfoBlocks();
    fixture.detectChanges();
    expect(closeClicked).toBeFalse();
    expect(getCloseButtonDe()).not.toBeNull();
  };

  const getCloseButtonDe = () => fixture.debugElement.query(By.css('[data-testid="close-button"]'));

  it('should emit closeClicked event if close button is clicked', () => {
    prepareSelectedMarker();
    getCloseButtonDe().nativeElement.click();
    expect(closeClicked).toBeTrue();
  });

  it('should emit closeClicked event if escape key is clicked', () => {
    prepareSelectedMarker();
    component.onEscapePressed();
    expect(closeClicked).toBeTrue();
  });
});

describe('InfoBoxComponent#shouldRender', () => {
  const component = new InfoBoxComponent(null);

  beforeEach(() => {
    component.infoBoxTemplate = undefined;
  });

  it('should return false if !selectedMarker', () => {
    [null, undefined, null].forEach(selectedMarker => {
      component.selectedMarker = selectedMarker;
      expect(component.shouldRender()).toBeFalse();
    });
  });

  it('should return false if !selectedMarker.infoBlocks and !infoBoxTemplate', () => {
    component.selectedMarker = {...createMarkerWithoutInfoBlocks()};
    expect(component.shouldRender()).toBeFalse();
  });

  it('should return false if !selectedMarker.infoBlocks.length and !infoBoxTemplate', () => {
    component.selectedMarker = {
      ...createMarkerWithoutInfoBlocks(),
      infoBlocks: [],
    };
    expect(component.shouldRender()).toBeFalse();
  });

  it('should return true if infoBoxTemplate', () => {
    component.selectedMarker = createMarkerWithoutInfoBlocks();
    // dirty hack
    component.infoBoxTemplate = 1 as unknown as TemplateRef<any>;
    expect(component.shouldRender()).toBeTrue();
  });

  it('should return true if selectedMarker.infoBlocks.length', () => {
    component.selectedMarker = createMarkerWithInfoBlocks();
    expect(component.shouldRender()).toBeTrue();
  });
});

const createMarkerWithoutInfoBlocks = () => ({
  id: 'work',
  title: 'Office',
  position: [7.446450, 46.961409],
  category: 'WARNING',
});

const createMarkerWithInfoBlocks = () => ({
  ...createMarkerWithoutInfoBlocks(),
  infoBlocks: [
    {
      type: 'TEXT',
      title: 'Lorem Ipsum',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisici elit',
    } as TextInfoBlock,
    {
      type: 'BUTTON',
      title: 'Bavaria Ipsum',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    } as ButtonInfoBlock,
  ],
});
