import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpBasicAuthInterceptor} from './interceptors/http-basic-auth-interceptor';
import {ArcgisFeatureLayerComponent} from './arcgis-feature-layer.component';

@NgModule({
  declarations: [
    ArcgisFeatureLayerComponent
  ],
  imports: [CommonModule],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpBasicAuthInterceptor, multi: true},
  ],
  exports: [
    ArcgisFeatureLayerComponent
  ],
})
export class ArcgisFeatureLayerModule {
}
