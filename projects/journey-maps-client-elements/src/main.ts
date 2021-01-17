import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// TODO ses: At the moment we need zone.js
//  The ESTA autocomplete component does not work correctly when doing manual change detection.
// platformBrowserDynamic()
//   .bootstrapModule(AppModule, {ngZone: 'noop'})
//   .catch(err => console.error(err));

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
