import {MarkerDetailsComponent} from './marker-details.component';
import {TestDataService} from '../../services/test-data.service';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {JourneyMapsClientModule} from '../../journey-maps-client.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';


describe('MarkerDetailsComponent', () => {

  const testData = new TestDataService();

  let closeClicked = false;
  let component: MarkerDetailsComponent;
  let fixture: ComponentFixture<MarkerDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [JourneyMapsClientModule, NoopAnimationsModule, HttpClientModule],
    });
    fixture = TestBed.createComponent(MarkerDetailsComponent);
    component = fixture.componentInstance;
  });

  it('shouldRender should return false if !selectedMarker', () => {
    [null, undefined, null].forEach(selectedMarker => {
      component.selectedMarker = selectedMarker;
      component.ngOnChanges(undefined);
      expect(component.shouldRender).toBeFalse();
    });
  });

  it('shouldRender should return true if selectedMarker', () => {
    component.selectedMarker = testData.createMarker();
    component.ngOnChanges(undefined);
    expect(component.shouldRender).toBeTrue();
  });

  it('should emit closeClicked event if escape key is clicked', () => {
    component.closeClicked.subscribe(() => closeClicked = true);
    component.selectedMarker = testData.createMarker();
    fixture.detectChanges();
    expect(closeClicked).toBeFalse();
    component.onEscapePressed();
    expect(closeClicked).toBeTrue();
  });
});
