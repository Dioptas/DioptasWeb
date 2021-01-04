import * as d3 from 'd3';
import {Subject} from 'rxjs';

import BrushY from './brush-Y';
import ColorScalebar from './color-scalebar';

export default class ImageHistogram {
  margin = {
    top: 10,
    right: 20,
    bottom: 10,
    left: 20,
    between: 0
  };
  #width = 100;
  #height = 400;

  rootElement;
  histPlot;
  histPath;
  colorScaleBar;
  colorScale;
  x;
  xAxis;
  y;
  yAxis;

  hist;
  histLine;
  histXY;
  brush;
  brushElement;

  rangeChanged = new Subject();
  colorLut;
  #clip;
  #plotWidth;
  #plotHeight;
  #colorBarWidth;
  #colorBarHeight;

  set width(newWidth) {
    this.#width = newWidth;
    this.#plotWidth = this.#colorBarWidth = newWidth - this.margin.left - this.margin.right;
    if (this.orientation === 'vertical') {
      this.#plotWidth *= 2 / 3;
      this.#colorBarWidth *= 1 / 3;
    }
  }

  get width(): number {
    return this.#width;
  }

  get height(): number {
    return this.#height;
  }

  set height(newHeight) {
    this.#height = newHeight;
    this.#plotHeight = this.#colorBarHeight = newHeight - this.margin.top - this.margin.bottom;
    console.log(this.#plotHeight);
    if (this.orientation === 'horizontal') {
      this.#plotHeight *= 2 / 3;
      this.#colorBarHeight *= 1 / 3;
    }
  }

  constructor(
    public selector, width = 100, height = 300,
    public orientation = 'vertical') {
    this.width = width;
    this.height = height;

    this.colorScale = d3
      .scaleSequential(d3.interpolateInferno)
      .domain([1, 65536]);

    this._initRoot();
    this._initPlot();

    this._initClip();
    this._initScale();
    this._initBrush();
    this._initColorBar();
  }

  _initRoot(): void {
    this.rootElement = d3
      .select(this.selector)
      .append('svg')
      .attr('width', this.#width)
      .attr('height', this.#height);
  }

  _initPlot(): void {
    const histPlotX = this.margin.left;
    const histPlotY = this.orientation === 'vertical' ? this.margin.top : this.#colorBarHeight + this.margin.top;

    this.histPlot = this.rootElement
      .append('g')
      .attr(
        'transform',
        'translate(' + histPlotX + ',' + histPlotY + ')'
      )
      .attr('width', this.#plotWidth)
      .attr('height', this.#plotHeight)
      .on('contextmenu', () => {
        d3.event.preventDefault();
      });

    this.histPath = this.histPlot.append('g');
  }

  _initClip(): void {
    this.#clip = this.histPlot
      .append('clipPath')
      .attr('id', 'histogramClip')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.#plotWidth)
      .attr('height', this.#plotHeight);
  }

  _initScale(): void {
    this.x = d3
      .scaleLog()
      .domain([1e-10, 100])
      .range([0, this.#plotWidth]);

    this.y = d3
      .scaleLog()
      .domain([1e-10, 100])
      .range([this.#plotHeight, 0]);
  }

  _initBrush(): void {
    this.brush = new BrushY(
      this.histPlot,
      [0, -this.#plotHeight / 2],
      [this.#plotWidth, this.height * 1.5],
      [0, this.#plotHeight],
      'url(#histogramClip)'
    );
    this.brush.brushEnded.subscribe(selection => this._brushed(selection));
  }

  _brushed(selection): void {
    const min = this.y.invert(selection[0]);
    const max = this.y.invert(selection[1]);
    this._updateColorScale(min, max);
  }

  _updateColorScale(min, max): void {
    this.colorScale.domain([min, max]);
    this.rangeChanged.next([min, max]);
  }

  _initColorBar(): void {
    const colorBarX = this.orientation === 'vertical' ? this.margin.left + this.#plotWidth : 0;
    const colorBarY = this.orientation === 'vertical' ? this.margin.top : this.margin.top + this.#plotHeight;
    this.colorScaleBar = new ColorScalebar(
      this.rootElement,
      this.#colorBarWidth,
      this.#colorBarHeight,
      colorBarX,
      colorBarY
    );
  }

  calculateHistogram(imageData, bins: any = 'sqrt'): any {
    // find minimum and maximum
    let min = Infinity;
    let max = -Infinity;
    const length = imageData.length;

    for (let i = 0; i < length; i++) {
      if (imageData[i] < min) {
        min = imageData[i];
      } else if (imageData[i] > max) {
        max = imageData[i];
      }
    }

    // get histogram
    if (bins === 'sqrt') {
      bins = Math.floor(Math.sqrt(length));
    }
    const step = Math.ceil(d3.max([1, Math.sqrt(length) / 200]));
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

    this.hist = {
      data: histogram,
      binCenters,
      min,
      max,
      binSize
    };

    return this.hist;
  }

  updateImage(imageData): void {
    this.calculateHistogram(imageData);
    this.plotHistogram();
  }

  plotHistogram(): void {
    this.histXY = [];
    let dataMin = Infinity;
    for (let i = 0; i < this.hist.data.length; i++) {
      if (this.hist.data[i] !== 0 && this.hist.binCenters[i] !== 0) {
        if (this.hist.data[i] < dataMin) {
          dataMin = this.hist.data[i];
        }
        this.histXY.push({x: this.hist.binCenters[i], y: this.hist.data[i]});
      }
    }

    if (this.orientation === 'vertical') {
      this.x.domain([dataMin, d3.max(this.hist.data)]);
      this.y.domain([d3.min(this.hist.binCenters), this.hist.max]);
    } else {
      this.x.domain([d3.min(this.hist.binCenters), this.hist.max]);
      this.y.domain([dataMin, d3.max(this.hist.data)]);
    }
    this._updateHistogramLine();
  }

  _updateHistogramLine(): void {
    // if (!this.histXY) {
    //   return;
    // }

    this.histLine = d3
      .line()
      .x(d => {
        // @ts-ignore
        return this.orientation === 'vertical' ? this.x(d.y) : this.x(d.x);
      })
      .y(d => {
        // @ts-ignore
        return this.orientation === 'vertical' ? this.y(d.x) : this.y(d.y);
      });
    // Create line
    const path = this.histPath.selectAll('path').data([this.histXY]);
    path
      .transition()
      .duration(0)
      .attr('d', this.histLine)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5);
    path
      .enter()
      .append('path')
      .attr('d', this.histLine)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 0.5);
    path.exit().remove();
  }

  calcColorImage(imageArray): Uint8Array {
    const colorImageArray = new Uint8Array(imageArray.length * 3);
    let pos = 0;
    let c;
    this.calcColorLut();
    for (let i = 0; i < imageArray.length; i++) {
      c = this.colorLut[imageArray[i]];
      pos = i * 3;
      colorImageArray[pos] = c[0];
      colorImageArray[pos + 1] = c[1];
      colorImageArray[pos + 2] = c[2];
    }
    return colorImageArray;
  }

  calcColorLut(): void {
    const min = this.hist.min;
    const max = this.hist.max + 1;
    this.colorLut = new Array(max - min);
    const colorScaleMin = d3.max([
      Math.floor(this.colorScale.domain()[0]),
      min
    ]);
    const colorScaleMax = d3.min([
      Math.floor(this.colorScale.domain()[1]),
      max
    ]);

    const colorMin = this.hexToRgb(this.colorScale(colorScaleMin));
    const colorMax = this.hexToRgb(this.colorScale(colorScaleMax));

    for (let i = 0; i < colorScaleMin; i++) {
      this.colorLut[i] = colorMin;
    }
    for (let i = colorScaleMin; i < colorScaleMax; i++) {
      this.colorLut[i] = this.hexToRgb(this.colorScale(min + i));
    }
    for (let i = colorScaleMax; i < max; i++) {
      this.colorLut[i] = colorMax;
    }
  }

  hexToRgb(hex): [number, number, number] {
    const bigint = parseInt(hex.substr(1), 16);
    // tslint:disable-next-line:no-bitwise
    const r = (bigint >> 16) & 255;
    // tslint:disable-next-line:no-bitwise
    const g = (bigint >> 8) & 255;
    // tslint:disable-next-line:no-bitwise
    const b = bigint & 255;
    return [r, g, b];
  }

  resize(width, height): void {
    this.width = width;
    this.height = height;

    this.rootElement
      .attr('width', this.width)
      .attr('height', this.height);

    this.histPlot
      .attr('width', this.#plotWidth)
      .attr('height', this.#plotHeight);

    this.x.range([0, this.#plotWidth]);
    this.y.range([this.#plotHeight, 0]);


    this._updateHistogramLine();

    this._resizeClip();
    this._resizeBrush();
    this._resizeColorbar();
  }

  _resizeClip(): void {
    this.#clip
      .transition()
      .duration(0)
      .attr('width', this.#plotWidth).attr('height', this.#plotHeight);
  }

  _resizeBrush(): void {
    this.brush.resize(
      [0, -this.#plotHeight / 2],
      [this.#plotWidth, this.height * 1.5]
    );
    this.brush.select([
      this.y(this.colorScale.domain()[1]),
      this.y(this.colorScale.domain()[0])
    ]);
  }

  _resizeColorbar(): void {
    const colorBarX = this.orientation === 'vertical' ? this.margin.left + this.#plotWidth : 0;
    const colorBarY = this.orientation === 'vertical' ? this.margin.top : this.margin.top + this.#plotHeight;
    this.colorScaleBar.resize(this.#colorBarWidth, this.#colorBarHeight);
    this.colorScaleBar.move(colorBarX, colorBarY);
  }

}
