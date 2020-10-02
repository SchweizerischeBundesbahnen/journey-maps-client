import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {JourneyMapsClientModule} from '../../../journey-maps-client/src/lib/journey-maps-client.module';

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
