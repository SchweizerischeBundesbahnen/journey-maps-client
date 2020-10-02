import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {JourneyMapsClientModule} from 'journey-maps-client';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    JourneyMapsClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
