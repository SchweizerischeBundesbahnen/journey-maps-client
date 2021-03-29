import {Injectable} from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Injectable()
export class MapLayerFilterService {

  private map: mapboxgl.Map;
  private knownLayerTypes = ['fill', 'fill-extrusion', 'line', 'symbol'];
  private knownLvlLayerIds: string[] = [];

  constructor() {
  }

  setMap(map: mapboxgl.Map): void {
    this.map = map;
    this.collectLvlLayers();
  }

  /*
  ["all",["==",["case",["has","level"],["get","level"],0],0],["==",["geometry-type"],"Polygon"]]
  ["==", "floor", 0]
  ["!=", "floor", 0] (It's a compound predicate because of NOT)
   */
  setLevelFilter(level: number): void {
    this.knownLvlLayerIds.forEach(layerId => {
      const oldFilter = this.map.getFilter(layerId);
      if (!oldFilter || oldFilter.length < 1) {
        return;
      }

      const newFilter = [];

      newFilter.push(oldFilter[0]);
      oldFilter.slice(1).forEach(part => {
        if (this.isString(part)) {
          // TODO: "floor" in "rokas_indoor" and "geojson_walk" layers
          newFilter.push(part);
        } else if (this.isArray(part)) {
          let levelFound = false;
          const newInnerPart = [part[0]];
          part.slice(1).forEach(innerPart => {
            const innerPartString = JSON.stringify(innerPart);
            if (innerPartString.startsWith('["case",["has","level"],["get","level"]')) {
              levelFound = true;
              newInnerPart.push(innerPart);
            } else if (levelFound) {
              levelFound = false;
              newInnerPart.push(level);
            } else {
              newInnerPart.push(innerPart);
            }
          });
          newFilter.push(newInnerPart);
        } else {
          newFilter.push(part);
        }
      });

      this.map.setFilter(layerId, newFilter);

      this.setLayerVisibility('rokas_background_mask', level < 0);
    });
  }

  private collectLvlLayers(): void {
    this.map.getStyle().layers.forEach(layer => {
      if (this.knownLayerTypes.includes(layer.type) &&
        (layer.id.endsWith('-lvl')
          || layer.id.startsWith('rokas_indoor')
          || layer.id.startsWith('geojson_walk'))
      ) {
        this.knownLvlLayerIds.push(layer.id);
      }
    });
  }

  private isString(value: any): boolean {
    return Object.prototype.toString.call(value) === '[object String]';
  }

  private isArray(value: any): boolean {
    return Object.prototype.toString.call(value) === '[object Array]';
  }

  private setLayerVisibility(layerIdPrefix: string, show: boolean): void {
    this.map.getStyle().layers.forEach(layer => {
      if (layer.id.startsWith(layerIdPrefix)) {
        try {
          (this.map.getLayer(layer.id) as any).visibility = show ? 'visible' : 'none';
        } catch (e) {
          console.error('Failed to set layer visibility', layer.id, e);
        }
      }
    });
  }
}
