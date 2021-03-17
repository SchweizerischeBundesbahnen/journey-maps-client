import {Injectable} from '@angular/core';
import {MapService} from './map.service';
import {MapRouteService} from './map-route.service';
import {MapTransferService} from './map-transfer.service';

@Injectable({
  providedIn: 'root'
})
export class MapJourneyService {

  constructor(private mapService: MapService,
              private mapRouteService: MapRouteService,
              private mapTransferService: MapTransferService
  ) {
  }

  updateJourneyRaw(map: mapboxgl.Map, journeyGeoJSON: string): void {
    let featureCollection: GeoJSON.FeatureCollection;
    if (journeyGeoJSON?.length) {
      featureCollection = JSON.parse(journeyGeoJSON) as GeoJSON.FeatureCollection;
    } else {
      featureCollection = this.mapService.emptyFeatureCollection;
    }

    const routeFeatures: GeoJSON.Feature[] = [];
    const transferFeatures: GeoJSON.Feature[] = [];

    for (const feature of featureCollection.features) {
      const properties = feature.properties;
      const type = properties.type;
      const pathType = properties.pathType;

      if (type === 'path' && (pathType === 'transport' || pathType === 'bee')) {
        routeFeatures.push(feature);
      } else if (type === 'bbox' || type === 'stopover') {
        // Ignore the feature (NOSONAR)
      } else {
        transferFeatures.push(feature);
      }
    }

    this.mapRouteService.updateRoute(map, {type: 'FeatureCollection', features: routeFeatures});
    this.mapTransferService.updateTransfer(map, {type: 'FeatureCollection', features: transferFeatures});
  }
}