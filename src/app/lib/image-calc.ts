import * as d3 from 'd3';

export function calcColorLut(min: number, max: number, colorScale): number[] {
  const colorLut = new Array(max - min);
  const colorScaleMin = d3.max([
    Math.floor(colorScale.domain()[0]),
    min
  ]);
  const colorScaleMax = d3.min([
    Math.floor(colorScale.domain()[1]),
    max
  ]);

  const colorMin = hexToRgb(colorScale(colorScaleMin));
  const colorMax = hexToRgb(colorScale(colorScaleMax));

  for (let i = 0; i < colorScaleMin; i++) {
    colorLut[i] = colorMin;
  }
  for (let i = colorScaleMin; i < colorScaleMax; i++) {
    colorLut[i] = hexToRgb(colorScale(min + i));
  }
  for (let i = colorScaleMax; i < max; i++) {
    colorLut[i] = colorMax;
  }
  return colorLut;
}

function hexToRgb(hex): [number, number, number] {
  const bigint = parseInt(hex.substr(1), 16);
  // tslint:disable-next-line:no-bitwise
  const r = (bigint >> 16) & 255;
  // tslint:disable-next-line:no-bitwise
  const g = (bigint >> 8) & 255;
  // tslint:disable-next-line:no-bitwise
  const b = bigint & 255;
  return [r, g, b];
}
