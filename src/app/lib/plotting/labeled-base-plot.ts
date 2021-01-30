import BasePlot from './base-plot';

export default class LabeledBasePlot extends BasePlot {
  xLabel;
  yLabel;

  setXAxisLabel(label: string): void {
    this.margin.bottom = 45;
    this.xLabel = this.rootElement.append('text')
      .attr('class', 'x label')
      .style('fill', 'white')
      .text(label);
    this.resize(this.width, this.height);
  }

  setYAxisLabel(label: string): void {
    this.margin.left = 60;
    this.yLabel = this.rootElement.append('text')
      .attr('class', 'y label')
      .attr('transform', 'rotate(-90)')
      .style('fill', 'white')
      .text(label);
    this.resize(this.width, this.height);
  }

  _updateAxisLabelPositions(): void {
    if (this.yLabel) {
      const labelHeight = this.yLabel.node().getBoundingClientRect().height;
      const labelWidth = this.yLabel.node().getBoundingClientRect().width;
      const yAxisWidth = this.yAxis.node().getBoundingClientRect().width;
      this.margin.left = labelWidth + yAxisWidth + 10;
      super.resize(this.width, this.height);
      this.yLabel
        .transition().duration(0)
        .attr('x', -this.plotHeight / 2 - labelHeight / 2)
        .attr('y', -yAxisWidth - 8);
    }
    if (this.xLabel) {
      const labelWidth = this.xLabel.node().getBoundingClientRect().width;
      this.xLabel
        .transition().duration(0)
        .attr('x', this.plotWidth / 2 - labelWidth / 2)
        .attr('y', this.height - 20);
    }
  }

  _update(duration: number = 0): void {
    super._update(duration);
    // the next function has to be delayed, to be able to see the actual width of the yAxis
    setTimeout(() => this._updateAxisLabelPositions(), 20);
  }

  resize(width, height): void {
    super.resize(width, height);
    this._updateAxisLabelPositions();
  }
}
