import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SourceHighlightComponent} from './components/source-highlight/source-highlight.component';
import {CommonModule} from '@angular/common';
import {HttpBasicAuthInterceptor} from './interceptors/http-basic-auth-interceptor';
import {HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN} from './interceptors/http-basic-auth-interceptor-config';
import {JourneyMapsClientModule} from '@schweizerischebundesbahnen/journey-maps-client/src/public-api';
import {ArcgisFeatureLayerModule} from '@schweizerischebundesbahnen/arcgis-feature-layer/src/public-api';
import {SbbTabsModule} from '@sbb-esta/angular/tabs';

@NgModule({
  declarations: [
    AppComponent,
    SourceHighlightComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HighlightModule,
    HttpClientModule,
    SbbTabsModule,
    JourneyMapsClientModule,
    ArcgisFeatureLayerModule, CommonModule,
  ],
  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js'),
      }
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpBasicAuthInterceptor,
      multi: true
    }, {
      provide: HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN,
      useValue: {serviceUrls: ['geo.sbb.ch', 'geo-int.sbb.ch', 'geo-dev.sbb.ch']},
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
