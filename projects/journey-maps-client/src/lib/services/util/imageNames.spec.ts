import {buildImageName, simpleHash} from './imageNames';

describe('simpleHash', () => {
  it('should hash strings', () => {
    expect(simpleHash('test')).toBe(3556498);
  });
});

describe('buildImageName', () => {
  it('should build different image names if at least one image path is different', () => {
    // @ts-ignore
    const icon = 'some/path/train.png';
    const similarIcon = 'some/OTHER/path/train.png';
    const iconSelected = 'some/path/train_selected.png';
    // @ts-ignore
    const imagePath = buildImageName({icon, iconSelected});
    // @ts-ignore
    const similarPath = buildImageName({icon: similarIcon, iconSelected});

    expect(imagePath).toBe('train_train_selected_1872940144');
    expect(similarPath).toBe('train_train_selected_1594891313');
  });
});
