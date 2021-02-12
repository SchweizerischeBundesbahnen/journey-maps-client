import {buildImageName, simpleHash} from './imageNames';

describe('map.service#simpleHash', () => {
  it('should hash strings', () => {
    expect(simpleHash('test')).toBe(3556498);
  });
});

describe('map.service#buildImageName', () => {
  it('should build image names', () => {
    // @ts-ignore
    const imageName = buildImageName({
      icon: 'some/path/train.png',
      iconSelected: 'some/path/train_selected.png',
    });
    expect(imageName).toBe('train_train_selected_1872940144');
  });
});
