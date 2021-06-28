import {Injectable} from '@angular/core';
import {Map as MapboxMap} from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class QueryMapFeaturesService {
  private readonly servicePointsMapSourceId = 'service_points';
  private readonly levelsFeaturePropertyName = 'floor_liststring';

  getVisibleLevels(map: MapboxMap): number[] {
    if (!map.getStyle().sources[this.servicePointsMapSourceId]) {
      console.error(`source '${this.servicePointsMapSourceId}' not found in map style.`);
      return [];
    }

    const servicePoints = map.querySourceFeatures(this.servicePointsMapSourceId);
    // check unique features: mapbox returns multiple same features
    if (new Set(servicePoints.map(feature => feature.id)).size !== 1) {
      // if more then one feature found, return empty -> keep current or use default levels as fallback.
      return [];
    }

    return this.extractLevels(servicePoints[0].properties);
  }

  private extractLevels(properties: any): number[] {
    if (!!properties && !!properties[this.levelsFeaturePropertyName]) {
      return properties[this.levelsFeaturePropertyName].split(',').map(f => Number(f)).reverse();
    } else {
      return [];
    }
  }
}
