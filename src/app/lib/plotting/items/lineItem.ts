import * as d3 from 'd3';
import {Item} from './item';

export default class LineItem extends Item {
  x: number[];
  y: number[];

  protected XY = [];
  protected lineElement;

  constructor(public color = 'white') {
    super();
  }

  setData(x, y): void {
    this.XY = [];
    for (let i = 0; i < x.length; i++) {
      this.XY.push({x: x[i], y: y[i]});
    }
    this.xRange.min = Math.min(...x);
    this.xRange.max = Math.max(...x);
    this.yRange.min = Math.min(...y);
    this.yRange.max = Math.max(...y);
    this.update();
    this.dataChanged.next();
  }

  createLineElement(): void {
    this.lineElement = d3
      .line()
      // @ts-ignore
      .x(d => this.xScale(d.x))
      // @ts-ignore
      .y(d => this.yScale(d.y));
  }

  updateLine(): void {
    // Create line
    const path = this.root.selectAll('path').data([this.XY]);
    path
      .transition()
      .duration(0)
      .attr('d', this.lineElement)
      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('stroke-width', 2)
      .attr('pointer-events', 'none');
    path
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', this.color)
      .attr('d', this.lineElement);
    path.exit().remove();
  }

  update(): void {
    this.createLineElement();
    this.updateLine();
  }
}
