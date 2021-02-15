import {buildImageName, simpleHash} from './imageNames';

describe('simpleHash', () => {
  it('should hash strings', () => {
    expect(simpleHash('test')).toBe(3556498);
  });
});

describe('buildImageName', () => {
  it('should build different image names if at least one image path is different', () => {
    // @ts-ignore
    const imagePath = buildImageName({
      icon: 'some/path/train.png',
      iconSelected: 'some/path/train_selected.png',
    });
    // @ts-ignore
    const similarPath = buildImageName({
      icon: 'some/other/path/train.png',
      iconSelected: 'some/path/train_selected.png',
    });

    expect(imagePath).toBe('train_train_selected_1872940144');
    expect(similarPath).toBe('train_train_selected_1780488111');
  });
});
