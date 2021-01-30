import * as d3 from 'd3';
import {Subject} from 'rxjs';

export default class BasePlot {
  static clipIndex = 0;

  mouseMoved = new Subject<{ x: number, y: number }>();
  mouseClicked = new Subject<{ x: number, y: number }>();

  svg;
  rootElement;

  margin = {
    left: 40,
    right: 20,
    top: 10,
    bottom: 30
  };

  x;
  y;
  xAxis;
  yAxis;

  plotWidth;
  plotHeight;

  clip;
  clipPath;

  brush;
  brushContext;
  brushLayer;

  mouseX;
  mouseY;
  plotDomainX = [0, 100];
  plotDomainY = [0, 100];

  constructor(selector, public width, public height) {
    this.plotWidth = this.width - this.margin.left - this.margin.right;
    this.plotHeight = this.height - this.margin.top - this.margin.bottom;
    this._initSVG(selector);
    this._initAxes();
    this._initClip();
    this._initBrush();
    this._initMousePosition();
    this._initWheel();
    this._initRightClickBehavior();
  }

  _initSVG(selector): void {
    this.svg = d3
      .select(selector)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.rootElement = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      )
      .on('contextmenu', () => {
        d3.event.preventDefault();
      });
  }

  _initAxes(): void {
    this.x = d3
      .scaleLinear()
      .domain(this.plotDomainX)
      .range([0, this.width - this.margin.left - this.margin.right]);

    this.xAxis = this.rootElement.append('g')
      .attr('transform', 'translate(0, ' + (this.height - this.margin.top - this.margin.bottom) + ')')
      .call(d3.axisBottom(this.x));

    // add Y Axis
    this.y = d3
      .scaleLinear()
      .domain(this.plotDomainY)
      .range([this.height - this.margin.top - this.margin.bottom, 0]);

    this.yAxis = this.rootElement.append('g').call(d3.axisLeft(this.y));
  }

  _initClip(): void {
    this.clipPath = 'clip' + BasePlot.clipIndex;
    BasePlot.clipIndex++;
    this.clip = this.rootElement.append('clipPath')
      .attr('id', this.clipPath)
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', this.plotWidth)
      .attr('height', this.plotHeight);
  }

  _initBrush(): void {
    this.brushContext = this.rootElement.append('g')
      .attr('id', 'brushContext2')
      .attr('class', 'brushContext');

    const updateChartBrush = () => {
      const extent = d3.event.selection;
      if (extent) {
        this._updateDomain(
          this.x.invert(extent[0][0]),
          this.x.invert(extent[1][0]),
          this.y.invert(extent[1][1]),
          this.y.invert(extent[0][1])
        );
        this.brushContext.select('.brush').call(this.brush.move, null); // this removes the grey brush area as soon as
        // the selection has been done
      }
      this._update();
    };

    // add brushing
    this.brush = d3
      .brush()
      .extent([
        [0, 0],
        [this.width - this.margin.left - this.margin.right,
          this.height - this.margin.top - this.margin.bottom]
      ])
      .on('end', updateChartBrush);

    this.brushLayer = this.brushContext
      .append('g')
      .attr('class', 'brush')
      .call(this.brush);
  }

  _initMousePosition(): void {
    const updateMousePosition = () => {
      const left = this.x.domain()[0];
      const right = this.x.domain()[1];
      const bottom = this.y.domain()[0];
      const top = this.y.domain()[1];

      const currentWidth = right - left;
      const currentHeight = Math.abs(top - bottom);

      const boundingRect = this.brushContext.node().getBoundingClientRect();

      this.mouseX =
        left +
        ((d3.event.x - boundingRect.left) / boundingRect.width) * currentWidth;
      this.mouseY =
        bottom +
        ((boundingRect.height - (d3.event.y - boundingRect.top)) /
          boundingRect.height) *
        currentHeight;
      this.mouseMoved.next({x: this.mouseX, y: this.mouseY});
    };

    this.brushContext.on('mousemove', updateMousePosition);
    this.brushContext.on('click', () => this.mouseClicked.next({x: this.mouseX, y: this.mouseY}));
  }

  _initWheel(): void {
    const wheelUpdate = () => {
      const left = this.x.domain()[0];
      const right = this.x.domain()[1];
      const bottom = this.y.domain()[0];
      const top = this.y.domain()[1];

      const factor = -d3.event.deltaY / 1000;

      const newLeft = left + (this.mouseX - left) * factor;
      const newRight = right - (right - this.mouseX) * factor;
      const newBottom = bottom + (this.mouseY - bottom) * factor;
      const newTop = top - (top - this.mouseY) * factor;

      this._updateDomain(newLeft, newRight, newBottom, newTop);
      this._update();
    };

    this.brushContext.on('wheel', wheelUpdate);
  }

  _initRightClickBehavior(): void {
    let dragMouseStartX;
    let dragMouseStartY;
    let domainXDragStart;
    let domainYDragStart;
    let dragging = false;

    const rightDragStart = () => {
      const event = d3.event;
      if (event.button === 2) {
        // only for right click
        if (event.detail === 1) {
          // only for single click
          dragMouseStartX = this.mouseX;
          dragMouseStartY = this.mouseY;
          domainXDragStart = this.x.domain();
          domainYDragStart = this.y.domain();
          this.brushContext.node().addEventListener('mousemove', rightDragMove);
        } // only for single clicks
      }
    };

    let lastUpdate = Date.now();
    const fps = 30;
    const frameTime = 1000 / fps;

    const rightDragMove = event => {
      dragging = true;

      if (Date.now() - lastUpdate < frameTime) {
        return;
      }

      const left = domainXDragStart[0];
      const right = domainXDragStart[1];
      const bottom = domainYDragStart[0];
      const top = domainYDragStart[1];

      const currentWidth = right - left;
      const currentHeight = Math.abs(top - bottom);

      const boundingRect = this.brushContext.node().getBoundingClientRect();

      const mouseX =
        left +
        ((event.x - boundingRect.left) / boundingRect.width) * currentWidth;
      const mouseY =
        bottom +
        ((boundingRect.height - (event.y - boundingRect.top)) /
          boundingRect.height) *
        currentHeight;

      const deltaX = mouseX - dragMouseStartX;
      const deltaY = mouseY - dragMouseStartY;

      this._updateDomain(
        left - deltaX,
        right - deltaX,
        bottom - deltaY,
        top - deltaY
      );
      this._update(0);

      lastUpdate = Date.now();
    };

    const rightDragStop = () => {
      const event = d3.event;
      if (event.button === 2) {
        // only for right click
        if (!dragging) {
          if (event.detail === 1) {
            // single click
            this.zoom(1.7);
          } else {
            // double click
            this.autoRange();
          }
        }
        this.brushContext.node().removeEventListener('mousemove', rightDragMove);
      }
      dragging = false;
    };

    this.brushContext.on('mousedown', rightDragStart);
    this.brushContext.on('mouseup', rightDragStop);
  }

  _update(duration = 0): void {
    this._updateAxes(duration);
  }

  _updateDomain(left, right, bottom, top): void {
    this.x.domain([left, right]);
    this.y.domain([bottom, top]);
  }

  autoRange(): void {
    const xMargin = 0.05 * (this.plotDomainX[1] - this.plotDomainX[0]);
    const yMargin = 0.05 * (this.plotDomainY[1] - this.plotDomainY[0]);
    this._updateDomain(
      this.plotDomainX[0] - xMargin,
      this.plotDomainX[1] + xMargin,
      this.plotDomainY[0] - yMargin,
      this.plotDomainY[1] + yMargin);
    this._update();
  }


  _updateAxes(duration = 400): void {
    this.xAxis
      .transition()
      .duration(duration)
      .call(d3.axisBottom(this.x));
    this.yAxis
      .transition()
      .duration(duration)
      .call(d3.axisLeft(this.y));
  }

  zoom(factor): void {
    const currentWidth = this.x.domain()[1] - this.x.domain()[0];
    const currentHeight = this.y.domain()[1] - this.y.domain()[0];
    const mouseXFrac = (this.mouseX - this.x.domain()[0]) / currentWidth;
    const mouseYFrac = (this.mouseY - this.y.domain()[0]) / currentHeight;
    const newLeft = this.x.domain()[0] - mouseXFrac * currentWidth * factor;
    const newRight = this.x.domain()[1] + (1 - mouseXFrac) * currentWidth * factor;
    const newBottom = this.y.domain()[0] - mouseYFrac * currentHeight * factor;
    const newTop = this.y.domain()[1] + (1 - mouseYFrac) * currentHeight * factor;
    this._updateDomain(newLeft, newRight, newBottom, newTop);
    this._update();
  }

  resize(width, height): void {
    this.width = width;
    this.height = height;
    this.plotWidth = this.width - this.margin.left - this.margin.right;
    this.plotHeight = this.height - this.margin.top - this.margin.bottom;

    this.svg
      .attr('width', this.width) // this.canvasWidth + this.margin.left + this.margin.right)
      .attr('height', this.height); // this.canvasHeight + this.margin.top + this.margin.bottom);


    this.rootElement
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      )
      .attr('width', this.plotWidth)
      .attr('height', this.plotHeight);

    this.clip
      .attr('width', this.plotWidth)
      .attr('height', this.plotHeight);

    this.x.range([0, this.plotWidth]);
    this.xAxis.attr('transform', 'translate(0, ' + this.plotHeight + ')');
    this.y.range([this.plotHeight, 0]);

    this._updateAxes(0);

    this.brush.extent([
      [0, 0],
      [this.plotWidth, this.plotHeight]
    ]);
    this.brushLayer.call(this.brush);
  }
}
