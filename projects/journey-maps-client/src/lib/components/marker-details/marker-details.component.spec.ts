import {TemplateRef} from '@angular/core';
import {MarkerDetailsComponent} from './marker-details.component';
import {TestDataService} from '../../services/test-data.service';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {JourneyMapsClientModule} from '../../journey-maps-client.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';


describe('MarkerDetailsComponent', () => {

  const testData = new TestDataService();

  let closeClicked = false;
  let component: MarkerDetailsComponent;
  let fixture: ComponentFixture<MarkerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JourneyMapsClientModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(MarkerDetailsComponent);
    component = fixture.componentInstance;
  });

  it('shouldRender() should return false if !selectedMarker', () => {
    [null, undefined, null].forEach(selectedMarker => {
      component.selectedMarker = selectedMarker;
      expect(component.shouldRender()).toBeFalse();
    });
  });

  it('shouldRender() should return false if !selectedMarker.infoBlocks and !template', () => {
    component.selectedMarker = {...testData.createMarkerWithoutInfoBlocks()};
    expect(component.shouldRender()).toBeFalse();
  });

  it('shouldRender() should return false if !selectedMarker.infoBlocks.length and !template', () => {
    component.selectedMarker = {
      ...testData.createMarkerWithoutInfoBlocks(),
      infoBlocks: [],
    };
    expect(component.shouldRender()).toBeFalse();
  });

  it('shouldRender() should return true if template', () => {
    component.selectedMarker = testData.createMarkerWithoutInfoBlocks();
    // dirty hack
    component.template = 1 as unknown as TemplateRef<any>;
    expect(component.shouldRender()).toBeTrue();
  });

  it('shouldRender() should return true if selectedMarker.infoBlocks.length', () => {
    component.selectedMarker = testData.createMarkerWithInfoBlocks();
    expect(component.shouldRender()).toBeTrue();
  });

  it('should emit closeClicked event if escape key is clicked', () => {
    component.closeClicked.subscribe(() => closeClicked = true);
    component.selectedMarker = testData.createMarkerWithInfoBlocks();
    fixture.detectChanges();
    expect(closeClicked).toBeFalse();
    component.onEscapePressed();
    expect(closeClicked).toBeTrue();
  });
});
