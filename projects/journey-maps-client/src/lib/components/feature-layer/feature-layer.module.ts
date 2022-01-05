import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FeatureLayerComponent} from './components/feature-layer.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpBasicAuthInterceptor} from './interceptors/http-basic-auth-interceptor';

@NgModule({
  declarations: [
    FeatureLayerComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpBasicAuthInterceptor, multi: true},
  ],
  exports: [FeatureLayerComponent],
})
export class FeatureLayerModule {
}
