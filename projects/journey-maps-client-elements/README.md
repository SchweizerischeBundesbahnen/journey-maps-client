# Journey Maps Client Elements (Web Component)

## <a name="testapp"></a>Test Application

https://ki-journey-maps-client.app.test04.otc-test.sbb.ch/journey-maps-client-elements/  
(Only accessible from within SBB network)

Source Code:

* SBB Bitbucket:  
  https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client
* Github:  
  https://github.com/SchweizerischeBundesbahnen/journey-maps-client

## API Documentation

https://ki-journey-maps-client.app.test04.otc-test.sbb.ch/documentation/components/JourneyMapsClientComponent.html  
(Only accessible from within SBB network)

* Angular `@Input` properties can be set on the created element directly. (See Test Application)
* Angular `@Output` are dispatched as HTML custom events. (See Test Application)

## Usage

### Installation

```
npm install --save @schweizerischebundesbahnen/journey-maps-client-elements
```

**NOTE**: We couldn't publish the library in the public NPM repository under `@schweizerischebundesbahnen`. (But we are
trying to get that organization name.)  
Therefore it's currently published under `@sbbch-rokas`.

* SBB Repository:  
  https://bin.sbb.ch/artifactory/rokas.npm/%40schweizerischebundesbahnen/journey-maps-client-elements/-/%40schweizerischebundesbahnen/
* Public NPM Repository:  
  https://www.npmjs.com/package/@sbbch-rokas/journey-maps-client-elements

### Hints

* The custom element is named `journey-maps-client`.
* You have to include `main-es2015.js`, `polyfills-es2015.js` and `styles.css` in your application to get it working.
* See the Test Application for usage examples.
* At the moment you cannot overwrite the marker teaser or popup with a custom template. (As it is possible
  with `ng-template`
  for the Angular version.)  
  We are working on it.
