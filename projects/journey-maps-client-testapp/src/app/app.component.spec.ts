import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {JourneyMapsClientComponent} from 'journey-maps-client';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        JourneyMapsClientComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
