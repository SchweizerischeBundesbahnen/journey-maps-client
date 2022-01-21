import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArcgisFeatureLayerComponent} from './arcgis-feature-layer.component';

@NgModule({
  declarations: [ArcgisFeatureLayerComponent],
  imports: [CommonModule],
  exports: [ArcgisFeatureLayerComponent],
})
export class ArcgisFeatureLayerModule {
}
