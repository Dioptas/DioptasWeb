import * as d3 from 'd3';

export interface Histogram {
  data: Uint32Array;
  binCenters: number[];
  min: number;
  max: number;
  binSize: number;
}

export function calcImageHistogram(imageData, bins: any = 'sqrt'): Histogram {
  // find minimum and maximum
  let min = Infinity;
  let max = -Infinity;
  const length = imageData.length;

  // get histogram
  if (bins === 'sqrt') {
    bins = Math.floor(Math.sqrt(length)) * 5;
  }
  const step = Math.ceil(d3.max([1, Math.sqrt(length) / 200]));

  for (let i = 0; i < length; i = i + step) {
    if (imageData[i] < min) {
      min = imageData[i];
    } else if (imageData[i] > max) {
      max = imageData[i];
    }
  }

  const binSize = (max - min) / bins;
  const histogram = new Uint32Array(bins).fill(0);

  for (let i = 0; i < imageData.length; i = i + step) {
    histogram[Math.floor((imageData[i] - min) / binSize)]++;
  }

  // calculate bin center positions
  const binCenters = new Array<number>(bins);
  const binOffset = binSize / 2 + min;
  for (let i = 0; i < bins; i++) {
    binCenters[i] = i * binSize + binOffset;
  }

  return {
    data: histogram,
    binCenters,
    min,
    max,
    binSize
  };
}

export function calcCumulativeHistogram(histogram: Histogram): Histogram {
  const cumHistogram = new Uint32Array(histogram.data.length).fill(0);
  cumHistogram[0] = histogram.data[0];
  for (let i = 1; i < histogram.data.length; i++) {
    cumHistogram[i] = cumHistogram[i - 1] + histogram.data[i];
  }
  return {
    data: cumHistogram,
    binCenters: histogram.binCenters,
    min: histogram.min,
    max: histogram.max,
    binSize: histogram.binSize
  };
}

export function calcColorLut(min: number, max: number, colorScale): number[] {
  max = max + 1;
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

export function calcColorImage(imageArray, colorLut): Uint8Array {
  const colorImageArray = new Uint8Array(imageArray.length * 3);
  let pos = 0;
  let c;
  for (let i = 0; i < imageArray.length; i++) {
    c = colorLut[imageArray[i]];
    if (!c) {
      c = [0, 0, 0];
    }
    pos = i * 3;
    colorImageArray[pos] = c[0];
    colorImageArray[pos + 1] = c[1];
    colorImageArray[pos + 2] = c[2];
  }
  return colorImageArray;
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
