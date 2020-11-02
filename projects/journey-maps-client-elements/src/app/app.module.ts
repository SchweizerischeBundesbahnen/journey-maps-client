import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule} from '@angular/core';
import {JourneyMapsClientModule} from '../../../journey-maps-client/src/lib/journey-maps-client.module';
import {JourneyMapsClientComponent} from '../../../journey-maps-client/src/lib/journey-maps-client.component';
import {createCustomElement} from '@angular/elements';


@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    JourneyMapsClientModule,
  ],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap(): void {
    const element = createCustomElement(JourneyMapsClientComponent, {injector: this.injector});
    customElements.define('journey-maps-client', element);
  }
}
