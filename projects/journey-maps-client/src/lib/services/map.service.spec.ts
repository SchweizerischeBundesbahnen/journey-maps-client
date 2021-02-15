import {MapService} from './map.service';
import {Marker} from '../model/marker';
import {Map} from 'mapbox-gl';
import {MarkerCategory} from '../model/marker-category.enum';

class MapServiceExtended extends MapService {
  addMissingImages(map: mapboxgl.Map, markers: Marker[]): void {
    super.addMissingImages(map, markers);
  }

  addMissingImage(map: mapboxgl.Map, name: string, icon: string): void {
    super.addMissingImage(map, name, icon);
  }
}

const createMarker = (
  {
    category = MarkerCategory.CUSTOM,
    icon,
    iconSelected,
  },
) => ({
  id: 'some id',
  title: 'some title',
  position: [7.446450, 46.961409],
  category,
  icon,
  iconSelected,
});


describe('MapService#addMissingImages', () => {
  const icon = 'some/icon/path/train.jpg';
  const similarIcon = 'some/OTHER/path/train.jpg';
  const iconSelected = 'some/icon/path/train_selected.jpg';
  let service: MapServiceExtended;
  let mapSpyObj: Map;

  beforeEach(() => {
    mapSpyObj = jasmine.createSpyObj(
      'mapSpyObj',
      ['hasImage', 'loadImage']
    );
    service = new MapServiceExtended(null);
    spyOn(service, 'addMissingImage');
  });

  it('should add missing images with identical paths only once', () => {
    const markers = [
      createMarker({icon, iconSelected}),
      createMarker({icon, iconSelected}),
    ];
    service.addMissingImages(mapSpyObj, markers);

    expect(service.addMissingImage).toHaveBeenCalledTimes(2);
    expect(service.addMissingImage)
      .toHaveBeenCalledWith(mapSpyObj, 'sbb_train_train_selected_2033534440_red', icon);
    expect(service.addMissingImage)
      .toHaveBeenCalledWith(mapSpyObj, 'sbb_train_train_selected_2033534440_black', iconSelected);
  });

  it('should add missing images with similar paths separately', () => {
    const markers = [
      createMarker({icon, iconSelected}),
      createMarker({icon: similarIcon, iconSelected}),
    ];
    service.addMissingImages(mapSpyObj, markers);

    expect(service.addMissingImage).toHaveBeenCalledTimes(4);
    expect(service.addMissingImage)
      .toHaveBeenCalledWith(mapSpyObj, 'sbb_train_train_selected_2033534440_red', icon);
    expect(service.addMissingImage)
      .toHaveBeenCalledWith(mapSpyObj, 'sbb_train_train_selected_2033534440_black', iconSelected);
    expect(service.addMissingImage)
      .toHaveBeenCalledWith(mapSpyObj, 'sbb_train_train_selected_1903310519_red', similarIcon);
    expect(service.addMissingImage)
      .toHaveBeenCalledWith(mapSpyObj, 'sbb_train_train_selected_1903310519_black', iconSelected);
  });
});
