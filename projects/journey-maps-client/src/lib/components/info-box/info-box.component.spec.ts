import {InfoBoxComponent} from './info-box.component';
import {InfoBlockType} from '../../model/infoblock/info-block-type.enum';
import {TextInfoBlock} from '../../model/infoblock/text-info-block';

describe('InfoBoxComponent#shouldRender', () => {
  const cut = new InfoBoxComponent(null);

  it('should return false if !selectedMarker', () => {
    [null, undefined, null].forEach(selectedMarker => {
      cut.selectedMarker = selectedMarker;
      expect(cut.shouldRender()).toBeFalse();
    });
  });

  it('should return false if !selectedMarker.infoBlocks and !infoBoxTemplate', () => {
    cut.selectedMarker = {...createMarkerWithoutInfoBlocks()};
    expect(cut.shouldRender()).toBeFalse();
  });

  it('should return false if !selectedMarker.infoBlocks.length and !infoBoxTemplate', () => {
    cut.selectedMarker = {
      ...createMarkerWithoutInfoBlocks(),
      infoBlocks: [],
    };
    expect(cut.shouldRender()).toBeFalse();
  });

  it('should return true if infoBoxTemplate', () => {
    // @ts-ignore
    cut.selectedMarker = createMarkerWithoutInfoBlocks();
    // TODO
    fail();
    // cut.infoBoxTemplate = {};
    expect(cut.shouldRender()).toBeTrue();
  });

  it('should return true if selectedMarker.infoBlocks.length', () => {
    // @ts-ignore
    cut.selectedMarker = {
      infoBlocks: [
        {
          type: InfoBlockType.TEXT,
          title: 'Lorem Ipsum',
          content: 'Lorem ipsum dolor sit amet, consectetur adipisici elit',
          cssClass: undefined
        } as TextInfoBlock
      ]
    };
    expect(cut.shouldRender()).toBeTrue();
  });
});

const createMarkerWithoutInfoBlocks = () => ({
  id: 'work',
  title: 'Office',
  position: [7.446450, 46.961409],
  category: 'MISSED_CONNECTION',
});
