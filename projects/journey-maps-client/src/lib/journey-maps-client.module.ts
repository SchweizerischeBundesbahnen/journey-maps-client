import {NgModule} from '@angular/core';
import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {InfoBoxComponent} from './components/info-box/info-box.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SBB_ICON_REGISTRY_PROVIDER, SbbIconModule} from '@sbb-esta/angular-core';
import {TextInfoBoxComponent} from './components/info-box/components/text-info-box/text-info-box.component';
import {ButtonInfoBoxComponent} from './components/info-box/components/button-info-box/button-info-box.component';
import {HtmlInfoBoxComponent} from './components/info-box/components/html-info-box/html-info-box.component';
import {SbbAutocompleteModule, SbbButtonModule, SbbSearchModule} from '@sbb-esta/angular-public';
import {SearchBarComponent} from './components/search-bar/search-bar.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularResizedEventModule} from 'angular-resize-event';
import {GlobalStylesComponent} from './components/global-styles/global-styles.component';


@NgModule({
  declarations: [
    JourneyMapsClientComponent,
    InfoBoxComponent,
    TextInfoBoxComponent,
    ButtonInfoBoxComponent,
    HtmlInfoBoxComponent,
    SearchBarComponent,
    GlobalStylesComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SbbIconModule,
    SbbButtonModule,
    SbbAutocompleteModule,
    SbbSearchModule,
    ReactiveFormsModule,
    AngularResizedEventModule,
  ],
  providers: [SBB_ICON_REGISTRY_PROVIDER],
  exports: [JourneyMapsClientComponent],
})
export class JourneyMapsClientModule {
}
