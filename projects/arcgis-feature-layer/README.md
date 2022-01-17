# ArcGIS Feature Layer (Angular Library)

This library can read GeoJSON data from an ArcGIS Feature Layer and display in a MapLibre map (https://maplibre.org/).

## Test Application

https://ki-journey-maps-client.apps.aws01t.sbb-aws-test.net/  
(Only accessible from within SBB network)

Source Code:

* SBB Bitbucket:  
  https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client
* Github:  
  https://github.com/SchweizerischeBundesbahnen/journey-maps-client

## API Documentation

https://ki-journey-maps-client.apps.aws01t.sbb-aws-test.net/documentation/components/ArcgisFeatureLayerComponent.html  
(Only accessible from within SBB network)

## Usage

### Installation

```
npm install --save @schweizerischebundesbahnen/arcgis-feature-layer
```

### Dependencies

The arcgis-feature-layer need a mapliber/mapbox map instance to be present. E.g.:
```
<rokas-journey-maps-client #theMap ...></rokas-journey-maps-client>
<sbb-arcgis-feature-layer [map]="theMap.mapReady | async" [options]="options" ></sbb-arcgis-feature-layer>
```
