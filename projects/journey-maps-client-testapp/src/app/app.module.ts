import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HIGHLIGHT_OPTIONS, HighlightModule} from 'ngx-highlightjs';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {SourceHighlightComponent} from './components/source-highlight/source-highlight.component';
import {SbbTabsModule} from '@sbb-esta/angular-public';
import {JourneyMapsClientModule} from '../../../journey-maps-client/src/lib/journey-maps-client.module';
import {ArcgisFeatureLayerModule} from '../../../arcgis-feature-layer/src/lib/arcgis-feature-layer.module';
import {CommonModule} from '@angular/common';
import {HttpBasicAuthInterceptor} from './interceptors/http-basic-auth-interceptor';
import {HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN} from './interceptors/http-basic-auth-interceptor-config';

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
    ArcgisFeatureLayerModule,
    CommonModule,
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
