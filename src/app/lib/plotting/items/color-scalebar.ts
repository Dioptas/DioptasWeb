import * as d3 from 'd3';

export default class ColorScalebar {
  colorScaleBar;

  constructor(parent, public width, public height, x = 0, y = 0, private orientation = 'vertical') {
    this.colorScaleBar = parent
      .append('g')
      .attr('transform', 'translate(' + x + ',' + y + ')')
      .attr('width', this.width)
      .attr('height', this.height)
      .on('contextmenu', () => {
        d3.event.preventDefault();
      });
    if (orientation === 'vertical') {
      this.createVerticalColorBar();
    } else {
      this.createHorizontalColorBar();
    }
  }

  createVerticalColorBar(): void {
    const colorScale = d3
      .scaleSequential(d3.interpolateInferno)
      .domain([0, this.height]);

    this.colorScaleBar
      .selectAll('.bars')
      .data(d3.range(this.height), d => {
        return d;
      })
      .enter()
      .append('rect')
      .attr('class', 'bars')
      .attr('y', (d, i) => {
        return this.height - i;
      })
      .attr('x', 0)
      .attr('height', 2)
      .attr('width', this.width)
      .style('fill', (d) => {
        return colorScale(d);
      });
  }

  createHorizontalColorBar(): void {
    const colorScale = d3
      .scaleSequential(d3.interpolateInferno)
      .domain([this.width, 0]);

    this.colorScaleBar
      .selectAll('.bars')
      .data(d3.range(this.width), d => {
        return d;
      })
      .enter()
      .append('rect')
      .attr('class', 'bars')
      .attr('x', (d, i) => {
        return this.width - i;
      })
      .attr('y', 0)
      .attr('height', this.height)
      .attr('width', 2)
      .style('fill', (d) => {
        return colorScale(d);
      });
  }

  resize(width, height): void {
    this.height = height;
    this.width = width;

    this.colorScaleBar
      .transition().duration(0)
      .attr('width', this.width)
      .attr('height', this.height);

    if (this.orientation === 'vertical') {
      this.updateVerticalColorScaleBar();
    } else {
      this.updateHorizontalColorScaleBar();
    }
  }

  updateVerticalColorScaleBar(): void {
    const colorScaleBars = this.colorScaleBar
      .selectAll('.bars')
      .data(d3.range(this.height), d => {
        return d;
      });

    const colorScale = d3
      .scaleSequential(d3.interpolateInferno)
      .domain([0, this.height]);

    colorScaleBars
      .transition()
      .duration(0)
      .attr('class', 'bars')
      .attr('y', (d, i) => {
        return this.height - i;
      })
      .attr('x', 0)
      .attr('height', 2)
      .attr('width', this.width)
      .style('fill', (d) => {
        return colorScale(d);
      });

    colorScaleBars
      .enter()
      .append('rect')
      .attr('class', 'bars')
      .attr('y', (d, i) => {
        return this.height - i;
      })
      .attr('x', 0)
      .attr('height', 2)
      .attr('width', this.width)
      .style('fill', (d) => {
        return colorScale(d);
      });

    colorScaleBars.exit().remove();
  }

  updateHorizontalColorScaleBar(): void {
    const colorScaleBars = this.colorScaleBar
      .selectAll('.bars')
      .data(d3.range(this.width), d => {
        return d;
      });

    const colorScale = d3
      .scaleSequential(d3.interpolateInferno)
      .domain([this.width, 0]);

    colorScaleBars
      .transition()
      .duration(0)
      .attr('class', 'bars')
      .attr('x', (d, i) => {
        return this.width - i;
      })
      .attr('y', 0)
      .attr('height', this.height)
      .attr('width', 2)
      .style('fill', (d) => {
        return colorScale(d);
      });

    colorScaleBars
      .enter()
      .append('rect')
      .attr('class', 'bars')
      .attr('x', (d, i) => {
        return this.width - i;
      })
      .attr('y', 0)
      .attr('width', 2)
      .attr('height', this.height)
      .style('fill', (d) => {
        return colorScale(d);
      });

    colorScaleBars.exit().remove();

  }

  move(x, y): void {
    this.colorScaleBar
      .transition()
      .duration(0)
      .attr('transform', 'translate(' + x + ',' + y + ')');
  }
}
