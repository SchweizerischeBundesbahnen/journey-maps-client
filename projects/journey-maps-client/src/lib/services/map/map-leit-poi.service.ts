import {Injectable} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import {MapService} from './map.service';
import {Subject} from 'rxjs';
import {LeitPoiFeature} from '../../components/leit-poi/model/leit-poi-feature';
import {Feature, Geometry} from 'geojson';
import {takeUntil} from 'rxjs/operators';
import {MapLeitPoiCreatorService} from './map-leit-poi-creator.service';
import {MapLeitPoi} from '../../model/map-leit-poi';

@Injectable({
  providedIn: 'root'
})
export class MapLeitPoiService {
  static LEIT_POI_PATH_TYPE = 'leit_poi';
  static DEFAULT_LEVEL = 0;
  // check the rokas map style: 16.5 or 15 like LevelSwitch:
  static LEIT_POI_MAX_MAP_ZOOM = 15;
  levelSwitched = new Subject<number>();
  destroyed = new Subject();

  private mapZoomSubscription: any;
  private leitPoiFeatures: LeitPoiFeature[] = [];
  private mapLeitPois: MapLeitPoi[] = [];

  constructor(private mapService: MapService, private mapLeitPoiCreator: MapLeitPoiCreatorService) {
  }

  destroy(): void {
    this.removeMapLeitPois();
    this.destroyed.next();
    this.destroyed.complete();
  }

  processData(map: mapboxgl.Map, featureCollection: GeoJSON.FeatureCollection = this.mapService.emptyFeatureCollection): void {
    this.removeMapLeitPois();
    if (!featureCollection || !featureCollection.features?.length) {
      return;
    }

    this.leitPoiFeatures = featureCollection.features
      .filter(f => !!f.properties?.step && f.properties?.pathType === MapLeitPoiService.LEIT_POI_PATH_TYPE)
      .map(f => this.convertToLeitPoiFeature(f))
      .filter(lp => !!lp);

    if (this.leitPoiFeatures.length) {
      this.registerMapZoomEvent(map);
      const routeStartLevelFeature = featureCollection.features
        .find(f => !!f.properties?.step && f.properties?.routeStartLevel);
      const routeStartLevel = routeStartLevelFeature ?
        Number(routeStartLevelFeature.properties?.routeStartLevel) : MapLeitPoiService.DEFAULT_LEVEL;
      this.setCurrentLevel(map, routeStartLevel);
      this.levelSwitched.next(routeStartLevel);
    }
  }

  setCurrentLevel(map: mapboxgl.Map, currentLevel: number): void {
    this.showLeitPoiByLevel(map, currentLevel);
  }

  private registerMapZoomEvent(map: mapboxgl.Map): void {
    if (!this.mapZoomSubscription) {
      this.mapZoomSubscription = map.on('zoomend', () => this.toggleMapLeitPoisVisibility(map.getZoom()));
    }
  }

  private toggleMapLeitPoisVisibility(currentZoomLevel: number): void {
    if (MapLeitPoiService.LEIT_POI_MAX_MAP_ZOOM >= currentZoomLevel) {
      this.hideLeitPois();
    } else {
      this.showLeitPois();
    }
  }

  private showLeitPois(): void {
    this.mapLeitPois.filter(p => !p.visible).forEach(p => {
      p.toggleHidden();
    });
  }

  private hideLeitPois(): void {
    this.mapLeitPois.filter(p => p.visible).forEach(p => {
      p.toggleHidden();
    });
  }

  private showLeitPoiByLevel(map: mapboxgl.Map, currentLevel: number): void {
    this.removeMapLeitPois();
    this.getFeaturesByLevel(currentLevel).forEach(f => this.showLeitPoi(map, f));
    this.toggleMapLeitPoisVisibility(map.getZoom());
  }

  private showLeitPoi(map: mapboxgl.Map, feature: LeitPoiFeature): void {
    const mapLeitPoi = this.mapLeitPoiCreator.createMapLeitPoi(map, feature);
    this.mapLeitPois.push(mapLeitPoi);

    mapLeitPoi.switchLevel.pipe(takeUntil(mapLeitPoi.destroyed)).subscribe(nextLevel => {
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

  private removeMapLeitPois(): void {
    this.mapLeitPois.forEach(p => p.destroy());
    this.mapLeitPois.length = 0;
  }
}
