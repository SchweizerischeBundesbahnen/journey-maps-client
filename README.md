# Journey Maps Client
## Documentation
### <a name="testapp"></a>Test App
https://ki-journey-maps-client.app.test04.otc-test.sbb.ch/
### API Documentation
https://ki-journey-maps-client.app.test04.otc-test.sbb.ch/documentation/components/JourneyMapsClientComponent.html
## Artifacts
### Angular library
```
npm install --save journey-maps-client
```
https://bin.sbb.ch/artifactory/rokas.npm/journey-maps-client/-/
#### Usage
See [Test App](#testapp)
### Web Component
```
npm install --save journey-maps-client-elements
```
https://bin.sbb.ch/artifactory/rokas.npm/journey-maps-client-elements/-/
#### Usage
See example code here: https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/browse/projects/journey-maps-client-elements/src/index.html

* The custom element is named `journey-maps-client`.
* You have to include `main-es2015.js` and/or `main-es5.js` in your application to get the custom element working. 
* We recommend declaring and initializing the custom element in Javascript (`document.createElement('journey-maps-client')`) rather than HTML (`<journey-maps-client>`). 
* Angular `@Input` properties can be set on the created element directly (See sample code for example).
* Angular `@Output` are dispatched as HTML custom events. (See sample code for example).
* See the API Documentation link above for details on Inputs and Outputs.
* At the moment you cannot overwrite the marker overlay with a custom template. (As it is possible with `ng-template` for the Angular version.)
