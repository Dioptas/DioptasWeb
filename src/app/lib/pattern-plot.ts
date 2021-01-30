import * as d3 from 'd3';

import LabeledBasePlot from './labeled-base-plot';
import Line from './line';

export default class PatternPlot extends LabeledBasePlot {
  lines: Line[];
  mainLine: Line;

  public enableAutoRange = true;

  constructor(selector, width, height) {
    super(selector, width, height);

    this.mainLine = new Line(this.rootElement, this.x, this.y, 'white', this.clipPath);
  }

  plot(x, y): void {
    this._updateDomainFromPlot(x, y);
    if (this.enableAutoRange) {
      this.autoRange();
    }
    this.mainLine.setData(x, y);
  }

  _updateDomainFromPlot(x, y): void {
    this.plotDomainX = [+d3.min(x), +d3.max(x)];
    this.plotDomainY = [+d3.min(y), +d3.max(y)];
  }

  _update(duration: number = 0): void {
    super._update(duration);
    this.mainLine.update();
  }

  resize(width, height): void {
    super.resize(width, height);
    this.mainLine.update();
  }
}
