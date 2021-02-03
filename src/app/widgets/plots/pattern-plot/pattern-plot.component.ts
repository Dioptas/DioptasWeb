import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import PatternPlot from '../../../lib/plotting/pattern-plot';
import {DioptasServerService} from '../../../shared/dioptas-server.service';
import LineItem from '../../../lib/plotting/items/lineItem';
import VerticalLineItem from '../../../lib/plotting/items/verticalLineItem';
import {MousePositionService} from '../../../shared/mouse-position.service';

@Component({
  selector: 'app-pattern-plot',
  templateUrl: './pattern-plot.component.html',
  styleUrls: ['./pattern-plot.component.css']
})
export class PatternPlotComponent implements OnInit, AfterViewInit {
  @Output() mouseMoved = new EventEmitter<{ x: number, y: number }>();
  @Output() mouseClicked = new EventEmitter<{ x: number, y: number }>();

  @ViewChild('container') plotContainer: ElementRef;

  throttleResize;
  throttleImageMouseMoved;

  plot: PatternPlot;
  mainLine: LineItem;
  verticalLine: VerticalLineItem;

  constructor(
    public dioptasService: DioptasServerService,
    public mouseService: MousePositionService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._initPlot();
    this._initMouseEvents();
    this._initResizeHandling();
  }

  _initPlot(): void {
    this.plot = new PatternPlot(
      '#pattern-plot',
      800, 300,
    );
    this.plot.setXAxisLabel('Two-Theta (°)');
    this.plot.setYAxisLabel('Intensity');

    this.mainLine = new LineItem();
    this.mainLine.autoRanged = true;
    this.plot.addItem(this.mainLine);

    this.verticalLine = new VerticalLineItem('yellowgreen');
    this.plot.addItem(this.verticalLine);

    this.verticalLine.setData(10);

    this.dioptasService.integratedPattern.subscribe((payload) => {
      this.mainLine.setData(payload.x, payload.y);
    });

  }

  _initMouseEvents(): void {
    this.throttleImageMouseMoved = _.throttle((x, y) => {
      this.mouseService.updatePatternMousePosition(x, y);
      this.mouseMoved.emit({x, y});
    }, 100);

    this.plot.mouseMoved.subscribe({
      next: ({x, y}) => {
        this.throttleImageMouseMoved(x, y);
      }
    });

    this.plot.mouseClicked.subscribe({
      next: ({x, y}) => {
        this.mouseClicked.emit({x, y});
        this.mouseService.updatePatternClickPosition(x, y);
      }
    });

    this.mouseService.anglesClicked.subscribe((data) => {
      this.verticalLine.setData(data.tth);
    });
  }

  _initResizeHandling(): void {
    this.throttleResize = _.throttle(() => {
      const width = this.plotContainer.nativeElement.clientWidth;
      const height = this.plotContainer.nativeElement.clientHeight;
      this.plot.resize(width, height);
    }, 50);

    setTimeout(() => this.throttleResize(), 50);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.throttleResize();
  }
}
