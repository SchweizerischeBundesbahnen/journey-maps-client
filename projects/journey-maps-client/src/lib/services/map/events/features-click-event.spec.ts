import {FeaturesClickEvent} from './features-click-event';
import {MaplibreMapMock} from '../../../model/maplibre-map-mock';
import {FeatureData, FeatureDataType} from '../../../journey-maps-client.interfaces';

describe('FeaturesClickEvent', () => {
  let featuresClickEvent: FeaturesClickEvent;
  let mapMock: MaplibreMapMock;
  let mapEventUtilsMock: any;

  beforeEach(() => {
    mapMock = new MaplibreMapMock();
    mapEventUtilsMock = {
      queryFeaturesByLayerIds: () => {
        return [{featureDataType: FeatureDataType.ROUTE} as FeatureData];
      }
    };

    const layers = new Map<string, FeatureDataType>();
    featuresClickEvent = new FeaturesClickEvent(mapMock.get(), mapEventUtilsMock, layers);
  });

  it('should be created', () => {
    expect(featuresClickEvent).toBeTruthy();
  });

  it('should submit on map click', (doneFn) => {
    featuresClickEvent.subscribe(() => {
      doneFn();
    });

    mapMock.raise('click');
  });
});
