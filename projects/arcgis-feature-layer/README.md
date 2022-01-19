# ArcGIS Feature Layer (Angular Library)

This library can read GeoJSON data from an ArcGIS Feature Layer and display in a MapLibre map (https://maplibre.org/).

## Test Application

https://ki-journey-maps-client.sbb-cloud.net/ 
(Only accessible from within SBB network)

## Source Code
https://code.sbb.ch/projects/KI_ROKAS/repos/journey-maps-client

## Usage

### Installation

```
npm install --save @schweizerischebundesbahnen/arcgis-feature-layer
```

### Dependencies

The arcgis-feature-layer need a mapliber/mapbox map instance to be present. 

### Example
```
<rokas-journey-maps-client #theMap ...></rokas-journey-maps-client>
<sbb-arcgis-feature-layer 
    [map]="theMap.mapReady | async" 
    [options]="{'url': 'https://geo.sbb.ch/site/rest/services/ROKAS_PUBLIC/POIService/FeatureServer/0'}"
></sbb-arcgis-feature-layer>
```

### Advanced examples

#### Advanced example 1: using GSharp basic-auth secured feature layer
https://sbb.sharepoint.com/sites/gsharpsbb/
```
<sbb-arcgis-feature-layer [map]="theMap.mapReady | async" [options]="{
    'url': 'https://geo.sbb.ch/site/rest/services/ROKAS_PUBLIC/POIService/FeatureServer/0',
    'requestWithCredentials': true
}"></sbb-arcgis-feature-layer>
```

#### Advanced example 2: using ArcGIS Online access-token secured feature layer
```
<sbb-arcgis-feature-layer [map]="theMap.mapReady | async" [options]="{
    'accessToken': {
      'token': '<YOUR_ARCGIS_AUTH_TOKEN>'
    },
    'url': 'https://services7.arcgis.com/RZYPa9cXL4L1fYTj/arcgis/rest/services/J-M-C-ArcGIS-TEST/FeatureServer/1'
}"></sbb-arcgis-feature-layer>
```

#### Advanced example 3: using custom map layer style
```
<sbb-arcgis-feature-layer [map]="theMap.mapReady | async" [options]="{
    'url': 'https://geo.sbb.ch/site/rest/services/ROKAS_PUBLIC/POIService/FeatureServer/0',
    'requestWithCredentials': true,
    'style': {
        'type': 'circle',
        'paint': {
            'circle-color': '#ffcc00',
            'circle-radius': 5
        }
    }
}"></sbb-arcgis-feature-layer>
```

#### Advanced example 4: specify an ID of an existing map layer to insert this layer before
```
<sbb-arcgis-feature-layer [map]="theMap.mapReady | async" [options]="{
    'url': 'https://services7.arcgis.com/RZYPa9cXL4L1fYTj/arcgis/rest/services/J-M-C-ArcGIS-TEST/FeatureServer/1',
    'addLayerBefore': 'poi_without_icons'
}"></sbb-arcgis-feature-layer>
```

#### Advanced example 5: define feature layer filter
```
<sbb-arcgis-feature-layer
      [map]="theMap.mapReady | async"
      [options]="{
        'url': 'https://geo.sbb.ch/site/rest/services/ROKAS_PUBLIC/POIService/FeatureServer/0',
        'filter':'CATEGORY=\'parking\'',
        'requestWithCredentials': true}"
></sbb-arcgis-feature-layer>
```
