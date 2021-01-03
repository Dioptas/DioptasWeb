import {Component, HostListener, OnInit} from '@angular/core';
import {DataGeneratorService} from '../../shared/data-generator.service';

@Component({
  selector: 'app-pattern-plot',
  templateUrl: './pattern-plot.component.html',
  styleUrls: ['./pattern-plot.component.scss']
})
export class PatternPlotComponent implements OnInit {
  public graph = {
    data: [
      {x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'}, hoverinfo: 'none'}
    ],
    layout: {
      font: {
        family: 'Arial, monospace',
        size: 18,
        color: 'rgb(178,178,178)'
      },
      xaxis: {
        title: '2θ (°)',
        showgrid: true,
        gridcolor: 'rgb(100, 100, 100)'
      },
      yaxis: {
        title: 'Intensity',
        gridcolor: 'rgb(100, 100, 100)'
      },
      margin: {
        l: 75,
        r: 50,
        b: 75,
        t: 10,
        pad: 4
      },
      autosize: true,
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
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
