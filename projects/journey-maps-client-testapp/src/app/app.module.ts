import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {JourneyMapsClientModule} from 'journey-maps-client';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    JourneyMapsClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
