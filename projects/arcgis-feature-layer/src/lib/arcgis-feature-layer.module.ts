import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArcgisFeatureLayerComponent} from './arcgis-feature-layer.component';
import {HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN} from './interceptors/http-basic-auth-interceptor-config';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpBasicAuthInterceptor} from './interceptors/http-basic-auth-interceptor';

@NgModule({
  declarations: [ArcgisFeatureLayerComponent],
  imports: [CommonModule],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpBasicAuthInterceptor,
    multi: true
  }, {
    provide: HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN,
    useValue: {serviceUrls: ['geo.sbb.ch', 'geo-int.sbb.ch', 'geo-dev.sbb.ch']},
    multi: true
  }],
  exports: [ArcgisFeatureLayerComponent],
})
export class ArcgisFeatureLayerModule {
}
