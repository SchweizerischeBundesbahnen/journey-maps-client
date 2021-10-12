# Journey Maps Client

## Test Applications

### <a name="testapp"></a>Angular

https://ki-journey-maps-client.app.test04.otc-test.sbb.ch/  
(Only accessible from within SBB network)

Source Code:

* SBB Bitbucket:  
  https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/browse/projects/journey-maps-client-testapp
* Github:  
  https://github.com/SchweizerischeBundesbahnen/journey-maps-client/tree/master/projects/journey-maps-client-testapp

### <a name="elements"></a>Web Component

https://ki-journey-maps-client.app.test04.otc-test.sbb.ch/journey-maps-client-elements/  
(Only accessible from within SBB network)

Source Code:

* SBB Bitbucket:  
  https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/browse/projects/journey-maps-client-elements
* Github:  
  https://github.com/SchweizerischeBundesbahnen/journey-maps-client/tree/master/projects/journey-maps-client-elements

## API Documentation

https://ki-journey-maps-client.app.test04.otc-test.sbb.ch/documentation/components/JourneyMapsClientComponent.html  
(Only accessible from within SBB network)

## Artifacts

### Angular library

```
npm install --save @schweizerischebundesbahnen/journey-maps-client
```

* SBB Repository:  
  https://bin.sbb.ch/artifactory/rokas.npm/%40schweizerischebundesbahnen/journey-maps-client/-/%40schweizerischebundesbahnen/
* Github Packages:  
  https://github.com/SchweizerischeBundesbahnen/journey-maps-client/packages/730124

#### Usage

See [Test App](#testapp)

You have to add the following two CSS files to your application:

* `node_modules/maplibre-gl/dist/maplibre-gl.css`
* `node_modules/@sbb-esta/angular-public/typography.css`

The neccessary NPM dependencies can be seen in the peer dependency section of the `package.json`.

* SBB Bitbucket:  
  https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/browse/projects/journey-maps-client/package.json
* Github:  
  https://github.com/SchweizerischeBundesbahnen/journey-maps-client/blob/master/projects/journey-maps-client/package.json

### Web Component

```
npm install --save @schweizerischebundesbahnen/journey-maps-client-elements
```

* SBB Repository:  
  https://bin.sbb.ch/artifactory/rokas.npm/%40schweizerischebundesbahnen/journey-maps-client-elements/-/%40schweizerischebundesbahnen/
* Github Packages:  
  https://github.com/SchweizerischeBundesbahnen/journey-maps-client/packages/732937

#### Usage

See example code at Web Component [Test App](#elements)

* The custom element is named `journey-maps-client`.
* You have to include `main-es2015.js` & `polyfills-es2015.js` (or `main-es5.js` & `polyfills-es5.js`) in your
  application to get the custom element working.
* We recommend declaring and initializing the custom element in
  Javascript `document.createElement('journey-maps-client')` rather than HTML `<journey-maps-client>`.
* Angular `@Input` properties can be set on the created element directly (See sample code for example).
* Angular `@Output` are dispatched as HTML custom events. (See sample code for example).
* See the API Documentation link above for details on Inputs and Outputs.
* At the moment you cannot overwrite the marker overlay with a custom template. (As it is possible with `ng-template`
  for the Angular version.)
