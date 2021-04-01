import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {SourceHighlightComponent} from './components/source-highlight/source-highlight.component';
import {JourneyMapsClientModule} from '../../../journey-maps-client/src/lib/journey-maps-client.module';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JourneyMapsClientModule
      ],
      declarations: [
        AppComponent,
        SourceHighlightComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
