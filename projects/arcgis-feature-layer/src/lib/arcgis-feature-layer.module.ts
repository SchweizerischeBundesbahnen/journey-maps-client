import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArcgisFeatureLayerComponent} from './arcgis-feature-layer.component';
import {HTTP_BASIC_AUTH_INTERCEPTOR_CONFIG_TOKEN} from './interceptors/http-basic-auth-interceptor-config';
import {HttpBasicAuthInterceptor} from './interceptors/http-basic-auth-interceptor';

@NgModule({
  declarations: [ArcgisFeatureLayerComponent],
  imports: [CommonModule],
  exports: [ArcgisFeatureLayerComponent],
})
export class ArcgisFeatureLayerModule {
}
