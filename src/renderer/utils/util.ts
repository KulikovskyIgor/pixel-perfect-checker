/* eslint-disable import/prefer-default-export */
export function getImageSize(
  src: string
): Promise<{ width: number; height: number }> {
  return new Promise<{ width: number; height: number }>((resolve) => {
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
