import {LeitPoiTravelType} from './leit-poi-travel-type';
import {LeitPoiTravelDirection} from './leit-poi-travel-direction';
import {LeitPoiPlacement} from './leit-poi-placement';
import {LngLatLike} from 'mapbox-gl';

export interface LeitPoiFeature {
  travelType: LeitPoiTravelType;
  travelDirection: LeitPoiTravelDirection;
  placement: LeitPoiPlacement;
  // TODO: if (sourceFloor != nextLevel)  do not show
  sourceLevel: number;
  location: LngLatLike;
  destinationLevel: number;
}
