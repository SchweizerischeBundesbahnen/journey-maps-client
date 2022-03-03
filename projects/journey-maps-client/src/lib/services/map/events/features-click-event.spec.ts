import {FeaturesClickEvent} from './features-click-event';
import {MaplibreMapMock} from '../../../model/maplibre-map-mock';
import {FeatureData, FeatureDataType, FeaturesClickEventData} from '../../../journey-maps-client.interfaces';

describe('FeaturesClickEvent', () => {
  let featuresClickEvent: FeaturesClickEvent;
  let mapMock: MaplibreMapMock;
  let mapEventUtilsMock: any;
  let featureData;

  beforeEach(() => {
    featureData = [
      {featureDataType: FeatureDataType.ROUTE},
      {featureDataType: FeatureDataType.ROUTE}
    ] as FeatureData[];

    mapMock = new MaplibreMapMock();
    mapEventUtilsMock = {
      queryFeaturesByLayerIds: () => {
        return featureData;
      }
    };

    const layers = new Map<string, FeatureDataType>();
    featuresClickEvent = new FeaturesClickEvent(mapMock.get(), mapEventUtilsMock, layers);
  });

  it('should be created', () => {
    expect(featuresClickEvent).toBeTruthy();
  });

  it('should submit event on map click', (doneFn) => {
    featuresClickEvent.subscribe((args: FeaturesClickEventData) => {
      expect(args.features.length).toBe(2);
      doneFn();
    });

    mapMock.raise('click');
  });

  it('should not submit event on map click when no features found.', (doneFn) => {
    featureData.length = 0;
    featuresClickEvent.subscribe(() => {
      fail('Should not raise this event.');
    });

    mapMock.raise('click');
    setTimeout(() => doneFn(), 1000);
  });
});