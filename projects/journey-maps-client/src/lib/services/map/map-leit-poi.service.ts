import {Injectable} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {MapService} from './map.service';
import {Subject} from 'rxjs';
import {LeitPoiFeature} from '../../components/leit-poi/model/leit-poi-feature';
import {Feature, Geometry} from 'geojson';
import {takeUntil} from 'rxjs/operators';
import {MapLeitPoiCreatorService} from './map-leit-poi-creator.service';

@Injectable({
  providedIn: 'root'
})
export class MapLeitPoiService {
  static LEIT_POI_PATH_TYPE = 'leit_poi';
  static DEFAULT_LEVEL = 0;
  levelSwitched = new Subject<number>();
  destroyed = new Subject();

  private leitPoiFeatures: LeitPoiFeature[] = [];
  private popups: mapboxgl.Popup[] = [];

  constructor(private mapService: MapService, private mapLeitPoiCreator: MapLeitPoiCreatorService) {
  }

  destroy(): void {
    this.removeMapPopups();
    this.destroyed.next();
    this.destroyed.complete();
  }

  processData(map: mapboxgl.Map, featureCollection: GeoJSON.FeatureCollection = this.mapService.emptyFeatureCollection): void {
    this.removeMapPopups();
    if (!featureCollection || !featureCollection.features?.length) {
      return;
    }

    this.leitPoiFeatures = featureCollection.features
      .filter(f => !!f.properties?.step && f.properties?.pathType === MapLeitPoiService.LEIT_POI_PATH_TYPE)
      .map(f => this.convertToLeitPoiFeature(f))
      .filter(lp => !!lp);

    // TODO: read the routeStartLevel
    this.setCurrentLevel(map, MapLeitPoiService.DEFAULT_LEVEL);
  }

  setCurrentLevel(map: mapboxgl.Map, currentLevel: number): void {
    this.showLeitPoiByLevel(map, currentLevel);
  }

  private showLeitPoiByLevel(map: mapboxgl.Map, currentLevel: number): void {
    this.removeMapPopups();
    this.getFeaturesByLevel(currentLevel).forEach(f => this.showLeitPoi(map, f));
  }

  private showLeitPoi(map: mapboxgl.Map, feature: LeitPoiFeature): void {
    const {component, popup} = this.mapLeitPoiCreator.createLeitPoi(map, feature);
    this.popups.push(popup);

    component.switchLevelClick.pipe(takeUntil(this.destroyed)).subscribe(nextLevel => {
      this.showLeitPoiByLevel(map, nextLevel);
      this.levelSwitched.next(nextLevel);
    });
  }

  private convertToLeitPoiFeature(feature: Feature<Geometry, { [p: string]: any }>): LeitPoiFeature | undefined {
    try {
      return {
        travelType: feature.properties.travelType.toLowerCase(),
        travelDirection: feature.properties.direction.toLowerCase(),
        placement: feature.properties.placement.toUpperCase(),
        sourceLevel: Number(feature.properties.sourceFloor),
        location: (feature.geometry as any).coordinates,
        destinationLevel: Number(feature.properties.destinationFloor),
      } as any;
    } catch (e) {
      console.error('Failed to convert Feature to LeitPoiFeature:', feature, e);
    }
  }

  private getFeaturesByLevel(currentLevel: number): LeitPoiFeature[] {
    return this.leitPoiFeatures.filter(f => f.sourceLevel === currentLevel);
  }

  private removeMapPopups(): void {
    this.popups.forEach(p => p.remove());
    this.popups.length = 0;
  }
}
