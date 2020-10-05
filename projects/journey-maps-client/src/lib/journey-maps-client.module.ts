import {NgModule} from '@angular/core';
import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {InfoBoxComponent} from './components/info-box/info-box.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SBB_ICON_REGISTRY_PROVIDER, SbbIconModule} from '@sbb-esta/angular-core';


@NgModule({
  declarations: [JourneyMapsClientComponent, InfoBoxComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SbbIconModule
  ],
  providers: [SBB_ICON_REGISTRY_PROVIDER],
  exports: [JourneyMapsClientComponent],
})
export class JourneyMapsClientModule {
}
