import {ComponentFixture, TestBed} from '@angular/core/testing';

import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('JourneyMapsClientComponent', () => {
  let component: JourneyMapsClientComponent;
  let fixture: ComponentFixture<JourneyMapsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [JourneyMapsClientComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyMapsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
