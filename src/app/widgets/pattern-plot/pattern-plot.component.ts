import {Component, HostListener, OnInit, EventEmitter, Output} from '@angular/core';
import {DataGeneratorService} from '../../shared/data-generator.service';
import {DioptasServerService} from '../../shared/dioptas-server.service';

@Component({
  selector: 'app-pattern-plot',
  templateUrl: './pattern-plot.component.html',
  styleUrls: ['./pattern-plot.component.scss']
})
export class PatternPlotComponent implements OnInit {
  @Output() mouseMoved = new EventEmitter<{ x: number, y: number }>();
  @Output() mouseClicked = new EventEmitter<{ x: number, y: number }>();

  public graph = {
    data: [
      {x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'white'}, hoverinfo: 'none'}
    ],
    layout: {
      font: {
        family: 'Arial, monospace',
        size: 14,
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
      height: '98%',
    }
  };

  constructor(
    private dataService: DataGeneratorService,
    private dioptasService: DioptasServerService) {
  }

  ngOnInit(): void {
    const graphData: { x: number[], y: number[] } = this.dataService.get_graph();
    this.graph.data[0].x = graphData.x;
    this.graph.data[0].y = graphData.y;

    this.dioptasService.patternChanged.subscribe((payload) => {
      this.graph.data[0].x = payload.x;
      this.graph.data[0].y = payload.y;
    });
  }

  @HostListener('contextmenu', ['$event'])
  onRightClick(event): void {
    event.preventDefault();
  }

  onHover(event): void {
    this.mouseMoved.emit({x: event.xvals[0], y: event.yvals[0]});
  }

  onClick(event): void {
    this.mouseClicked.emit({x: event.event.pointerX, y: event.event.pointerY});
  }
}
