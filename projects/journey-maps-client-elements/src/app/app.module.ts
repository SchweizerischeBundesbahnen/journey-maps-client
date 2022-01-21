import {ApplicationRef, CUSTOM_ELEMENTS_SCHEMA, DoBootstrap, Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
// Must be imported from dist!
// Needs rebuilds during local development but otherwise it won't work correctly. (e.g. inline SVG)
import {JourneyMapsClientComponent, JourneyMapsClientModule} from '@schweizerischebundesbahnen/journey-maps-client';


@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    JourneyMapsClientModule,
  ],
  providers: [],
  bootstrap: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule implements DoBootstrap {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap(appRef: ApplicationRef): void {
    const element = createCustomElement(JourneyMapsClientComponent, {injector: this.injector});
    customElements.define('journey-maps-client', element);
  }
}
