import {NgModule} from '@angular/core';
import {JourneyMapsClientComponent} from './journey-maps-client.component';
import {CommonModule} from '@angular/common';
import {SBB_ICON_REGISTRY_PROVIDER, SbbIconModule} from '@sbb-esta/angular-core';
import {SbbAutocompleteModule, SbbButtonModule, SbbSearchModule} from '@sbb-esta/angular-public';
import {SearchBarComponent} from './components/search-bar/search-bar.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularResizedEventModule} from 'angular-resize-event';
import {GlobalStylesComponent} from './components/global-styles/global-styles.component';
import {MarkerDetailsComponent} from './components/marker-details/marker-details.component';
import {LevelSwitchComponent} from './components/level-switch/level-switch.component';
import {TextInfoBlockComponent} from './components/marker-details/components/info-block-renderer/components/text-info-block/text-info-block.component';
import {ButtonInfoBlockComponent} from './components/marker-details/components/info-block-renderer/components/button-info-block/button-info-block.component';
import {PopupComponent} from './components/marker-details/components/popup/popup.component';
import {TeaserComponent} from './components/marker-details/components/teaser/teaser.component';
import {InfoBlockRendererComponent} from './components/marker-details/components/info-block-renderer/info-block-renderer.component';
import {AddressInfoBlockComponent} from './components/marker-details/components/info-block-renderer/components/address-info-block/address-info-block.component';


@NgModule({
  declarations: [
    JourneyMapsClientComponent,
    TeaserComponent,
    TextInfoBlockComponent,
    ButtonInfoBlockComponent,
    SearchBarComponent,
    GlobalStylesComponent,
    LevelSwitchComponent,
    PopupComponent,
    MarkerDetailsComponent,
    InfoBlockRendererComponent,
    AddressInfoBlockComponent
  ],
  imports: [
    CommonModule,
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
