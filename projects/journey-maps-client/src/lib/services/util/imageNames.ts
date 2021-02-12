import {Marker} from '../../model/marker';

function buildImageName(marker: Marker): string {
  const hash = simpleHash(`${marker.icon}${marker.iconSelected}`);
  return `${convertToImageName(marker.icon)}_${convertToImageName(marker.iconSelected)}_${hash}`;
}

function convertToImageName(iconPath: string): string {
  return iconPath.substring(iconPath.lastIndexOf('/') + 1, iconPath.lastIndexOf('.'));
}

function simpleHash(value: string): number {
  return Math.abs(
    // https://stackoverflow.com/a/34842797/349169
    // tslint:disable-next-line:no-bitwise
    value.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0)
  );
}

export {buildImageName, simpleHash};
