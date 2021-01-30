import * as d3 from 'd3';

export default class Line {
  x: number[];
  y: number[];

  private XY = [];
  private lineElement;
  private path;

  constructor(
    public parent,
    public xScale,
    public yScale,
    public color = 'white',
    public clipPath = 'clip'
  ) {
    this.path = parent.append('g')
      .attr('clip-path', 'url(#' + clipPath + ')');
  }

  setData(x, y): void {
    this.XY = [];
    for (let i = 0; i < x.length; i++) {
      this.XY.push({x: x[i], y: y[i]});
    }
    this.update();
  }

  update(): void {
    this.lineElement = d3
      .line()
      // @ts-ignore
      .x(d => this.xScale(d.x))
      // @ts-ignore
      .y(d => this.yScale(d.y));

    // Create line
    const path = this.path.selectAll('path').data([this.XY]);
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
}
