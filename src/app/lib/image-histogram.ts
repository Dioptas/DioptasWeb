import * as d3 from 'd3';
import {Subject} from 'rxjs';

import BrushY from './brush-Y';
import ColorScalebar from './color-scalebar';
import {calcColorLut, calcImageHistogram, calcColorImage} from './image-calc';

export default class ImageHistogram {
  margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    between: 0
  };
  #width = 100;
  #height = 400;

  histPlot;
  histPath;
  colorScaleBar: ColorScalebar;
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
  rootElement;

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
    if (this.orientation === 'horizontal') {
      this.#plotHeight *= 2 / 3;
      this.#colorBarHeight *= 1 / 3;
    }
  }

  constructor(
    public parentElement, width = 100, height = 300,
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
    this.rootElement = this.parentElement
      .append('g')
      .attr('width', this.#width)
      .attr('height', this.#height);
  }

  _initPlot(): void {

    this.histPlot = this.rootElement
      .append('g')
      .attr('width', this.#plotWidth)
      .attr('height', this.#plotHeight)
      .on('contextmenu', () => {
        d3.event.preventDefault();
      });

    this._movePlot();

    this.histPath = this.histPlot.append('g');
  }

  _movePlot(): void {
    const histPlotX = this.margin.left;
    const histPlotY = this.orientation === 'vertical' ? this.margin.top : this.#colorBarHeight + this.margin.top;

    this.histPlot
      .transition().duration(0)
      .attr(
        'transform',
        'translate(' + histPlotX + ',' + histPlotY + ')'
      );

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
    if (this.orientation === 'vertical') {
      this.brush = new BrushY(
        this.histPlot,
        [0, -this.#plotHeight / 2],
        [this.#plotWidth, this.height * 1.5],
        [0, this.#plotHeight],
        'url(#histogramClip)',
        this.orientation
      );
    } else {
      this.brush = new BrushY(
        this.histPlot,
        [-this.#plotWidth * 0.5, 0],
        [this.#plotWidth * 1.5, this.#plotHeight],
        [0, 0],
        'url(#histogramClip)',
        this.orientation
      );

    }
    this.brush.brushEnded.subscribe(selection => this._brushed(selection));
  }

  _brushed(selection): void {
    let min: number;
    let max: number;
    if (this.orientation === 'vertical') {
      min = this.y.invert(selection[0]);
      max = this.y.invert(selection[1]);
    } else {
      min = this.x.invert(selection[0]);
      max = this.x.invert(selection[1]);
    }
    this._updateColorScale(min, max);
  }

  _updateColorScale(min, max): void {
    this.colorScale.domain([min, max]);
    this.rangeChanged.next([min, max]);
  }

  _initColorBar(): void {
    const colorBarX = this.orientation === 'vertical' ? this.margin.left + this.#plotWidth : this.margin.left;
    const colorBarY = this.margin.top;
    this.colorScaleBar = new ColorScalebar(
      this.rootElement,
      this.#colorBarWidth,
      this.#colorBarHeight,
      colorBarX,
      colorBarY,
      this.orientation
    );
  }

  updateImage(imageData): void {
    this.hist = calcImageHistogram(imageData);
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
    const dataXRange = this.hist.max - +d3.min(this.hist.binCenters);

    if (this.orientation === 'vertical') {
      this.x.domain([dataMin, d3.max(this.hist.data)]);
      this.y.domain([+d3.min(this.hist.binCenters) * 0.5, this.hist.max + dataXRange]);
    } else {
      this.x.domain([+d3.min(this.hist.binCenters) * 0.5, this.hist.max + dataXRange]);
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
      .attr('stroke', 'rgb(220, 220, 220)')
      .attr('stroke-width', 1);
    path
      .enter()
      .append('path')
      .attr('d', this.histLine)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(220, 220, 220)')
      .attr('stroke-width', 1);
    path.exit().remove();
  }

  calcColorImage(imageArray): Uint8Array {
    this.colorLut = calcColorLut(this.hist.min, this.hist.max, this.colorScale);
    return calcColorImage(imageArray, this.colorLut);
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

    this._movePlot();

    this.x.range([0, this.#plotWidth]);
    this.y.range([this.#plotHeight, 0]);


    this._updateHistogramLine();
    this._resizeClip();
    this._resizeBrush();
    this._resizeColorbar();
  }

  move(x: number, y: number): void {
    this.rootElement
      .transition().duration(0)
      .attr('transform', 'translate(' + x + ',' + y + ')');
  }

  _resizeClip(): void {
    this.#clip
      .transition()
      .duration(0)
      .attr('width', this.#plotWidth).attr('height', this.#plotHeight);
  }

  _resizeBrush(): void {
    if (this.orientation === 'vertical') {
      this.brush.resize(
        [-2, -this.#plotHeight / 2],
        [this.#plotWidth + 2, this.height * 1.5]
      );
      this.brush.select([
        this.y(this.colorScale.domain()[1]),
        this.y(this.colorScale.domain()[0])
      ]);
    } else {
      this.brush.resize(
        [-this.#plotWidth * 0.5, -2],
        [this.#plotWidth * 1.5, this.#plotHeight + 2],
      );
      this.brush.select([
        this.x(this.colorScale.domain()[0]),
        this.x(this.colorScale.domain()[1])
      ]);
    }
  }

  _resizeColorbar(): void {
    const colorBarX = this.orientation === 'vertical' ? this.margin.left + this.#plotWidth : this.margin.left;
    const colorBarY = this.margin.top;

    this.colorScaleBar.resize(this.#colorBarWidth, this.#colorBarHeight);
    this.colorScaleBar.move(colorBarX, colorBarY);
  }
}
