import {Component, HostListener, OnInit} from '@angular/core';
import {DataGeneratorService} from '../shared/data-generator.service';

@Component({
  selector: 'app-plotly-example',
  templateUrl: './pattern-plot.component.html',
  styleUrls: ['./pattern-plot.component.scss']
})
export class PatternPlotComponent implements OnInit {
  public graph = {
    data: [
      {x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'}, hoverinfo: 'none'}
    ],
    layout: {
      xaxis: {
        title: '2θ (°)',
        showgrid: true,
      },
      yaxis: {
        title: 'Intensity'
      },
      margin: {
        l: 75,
        r: 50,
        b: 75,
        t: 10,
        pad: 4
      },
      autosize: true,
    },
    config: {
      responsive: true,
      scrollZoom: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['hoverClosestCartesian', 'hoverCompareCartesian']
    },
    style: {
      position: 'relative',
      width: '100%',
      height: '95%',
    }
  };

  mouseX = 0;
  mouseY = 0;

  constructor(private dataService: DataGeneratorService) {
  }

  ngOnInit(): void {
    const graphData: { x: number[], y: number[] } = this.dataService.get_graph();
    this.graph.data[0].x = graphData.x;
    this.graph.data[0].y = graphData.y;
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event): void {
    event.preventDefault();
  }

  onHover(event): void {
    this.mouseX = event.xvals[0];
    this.mouseY = event.yvals[0];
  }
}
