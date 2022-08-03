import { APP_WINDOW_WIDTH } from 'renderer/constants/common';
import { Size } from 'renderer/types';

export function getImageSize(src: string): Promise<Size> {
  return new Promise<Size>((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = src;
  });
}

export function floatToInt(num: number): number {
  return parseInt(Number(num).toFixed(), 10);
}

export function getScaledImageSize(zoom: number, imageSize: Size): Size {
  return {
    width: (imageSize.width * zoom) / 100,
    height: (imageSize.height * zoom) / 100,
  };
}

export function getWindowSize(imageSize: Size): Size {
  const width =
    imageSize.width < APP_WINDOW_WIDTH
      ? APP_WINDOW_WIDTH + 20
      : imageSize.width;

  return {
    width: floatToInt(width + 20),
    height: floatToInt(imageSize.height + 110),
  };
}
