import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';
import PatternPlot from '../../../lib/plotting/pattern-plot';
import {DioptasServerService} from '../../../shared/dioptas-server.service';
import LineItem from '../../../lib/plotting/items/lineItem';
import VerticalLineItem from '../../../lib/plotting/items/verticalLineItem';

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


  constructor(public dioptasService: DioptasServerService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.plot = new PatternPlot(
      '#pattern-plot',
      800, 300,
    );
    this.plot.setXAxisLabel('Two-Theta (°)');
    this.plot.setYAxisLabel('Intensity');

    this.mainLine = new LineItem();
    this.plot.addItem(this.mainLine);

    this.verticalLine = new VerticalLineItem('yellowgreen');
    this.plot.addItem(this.verticalLine);

    this.verticalLine.setData(10);

    this.dioptasService.patternChanged.subscribe((payload) => {
      this.mainLine.setData(payload.x, payload.y);
    });


    this.throttleImageMouseMoved = _.throttle((x, y) => {
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
        this.verticalLine.setData(x);
      }
    });

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
