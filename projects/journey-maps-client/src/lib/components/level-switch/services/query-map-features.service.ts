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
    // merge levels, when multiple stations found:
    const allLevels = servicePoints.map(servicePoint => this.extractLevels(servicePoint.properties));
    return Array.from(new Set([].concat(...allLevels))).reverse();
  }

  private extractLevels(properties: any): number[] {
    if (!!properties && !!properties[this.levelsFeaturePropertyName]) {
      return properties[this.levelsFeaturePropertyName].split(',').map(f => Number(f));
    } else {
      return [];
    }
  }
}
