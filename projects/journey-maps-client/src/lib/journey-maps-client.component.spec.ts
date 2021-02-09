import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {InfoBoxComponent} from './components/info-box/info-box.component';

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
