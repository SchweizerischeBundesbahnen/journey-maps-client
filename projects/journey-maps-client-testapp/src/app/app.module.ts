import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import {HttpClientModule} from '@angular/common/http';
import {SourceHighlightComponent} from './components/source-highlight/source-highlight.component';
import {TabsModule} from '@sbb-esta/angular-public';
import {JourneyMapsClientModule} from '../../../journey-maps-client/src/lib/journey-maps-client.module';

@NgModule({
  declarations: [
    AppComponent,
    SourceHighlightComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HighlightModule,
    HttpClientModule,
    TabsModule,
    JourneyMapsClientModule
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
