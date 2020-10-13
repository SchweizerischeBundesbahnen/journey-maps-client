import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {JourneyMapsClientComponent} from '../../../journey-maps-client/src/lib/journey-maps-client.component';
import {InfoBoxComponent} from '../../../journey-maps-client/src/lib/components/info-box/info-box.component';
import {SourceHighlightComponent} from './components/source-highlight/source-highlight.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        AppComponent,
        JourneyMapsClientComponent,
        InfoBoxComponent,
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
