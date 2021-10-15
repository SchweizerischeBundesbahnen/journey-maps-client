# Journey Maps Client (Angular Library)

## Test Application

https://ki-journey-maps-client.app.test04.otc-test.sbb.ch/  
(Only accessible from within SBB network)

Source Code:

* SBB Bitbucket:  
  https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client
* Github:  
  https://github.com/SchweizerischeBundesbahnen/journey-maps-client

## API Documentation

https://ki-journey-maps-client.app.test04.otc-test.sbb.ch/documentation/components/JourneyMapsClientComponent.html  
(Only accessible from within SBB network)

## Usage

### Installation

```
npm install --save @schweizerischebundesbahnen/journey-maps-client
```

**NOTE**: We couldn't publish the library in the public NPM repository under `@schweizerischebundesbahnen`. (But we are
trying to get that organization name.)  
Therefore it's currently published under `@sbbch-rokas`.

* SBB Repository:  
  https://bin.sbb.ch/artifactory/rokas.npm/%40schweizerischebundesbahnen/journey-maps-client/-/%40schweizerischebundesbahnen/
* Public NPM Repository:  
  https://www.npmjs.com/package/@sbbch-rokas/journey-maps-client

### Dependencies

You have to add the following two CSS files to your application:

* `node_modules/maplibre-gl/dist/maplibre-gl.css`
* `node_modules/@sbb-esta/angular-public/typography.css`

The neccessary NPM dependencies can be seen in the peer dependency section of the `package.json`.

* SBB Bitbucket:  
  https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client/browse/projects/journey-maps-client/package.json
* Github:  
  https://github.com/SchweizerischeBundesbahnen/journey-maps-client/blob/master/projects/journey-maps-client/package.json
