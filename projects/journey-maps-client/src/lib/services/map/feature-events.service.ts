import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Map as MaplibreMap} from 'maplibre-gl';
import {FeaturesClickEvent} from './events/features-click-event';
import {FeaturesHoverEvent} from './events/features-hover-event';
import {FeaturesClickEventData, FeaturesHoverChangeEventData} from './../../journey-maps-client.interfaces';

/* PUBLIC interface */
export interface FeatureEventSubjects {
  click: Subject<FeaturesClickEventData>,
  hoverChange: Subject<FeaturesHoverChangeEventData>
}

@Injectable({
  providedIn: 'root'
})
export class FeatureEventsService {

  attachEvents(mapInstance: MaplibreMap, layerIds: string[]): FeatureEventSubjects {
    if (!layerIds.length) {
      return;
    }
    return {
      click: new FeaturesClickEvent(mapInstance, layerIds),
      hoverChange: new FeaturesHoverEvent(mapInstance, layerIds)
    };
  }

}
