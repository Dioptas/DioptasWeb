import * as d3 from 'd3';
import LineItem from './lineItem';

export default class VerticalLineItem extends LineItem {
  constructor(color = 'white') {
    super(color);
  }

  setData(x): void {
    this.x = x;
    this.update();
  }

  createLineElement(): void {
    this.XY = [
      {x: this.x, y: this.yScale.domain()[0]},
      {x: this.x, y: this.yScale.domain()[1]}
    ];
    this.lineElement = d3
      .line()
      // @ts-ignore
      .x(d => this.xScale(d.x))
      // @ts-ignore
      .y(d => this.yScale(d.y));
  }
}
