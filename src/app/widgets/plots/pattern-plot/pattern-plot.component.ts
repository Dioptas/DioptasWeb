import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import LabeledBasePlot from '../../../lib/labeled-base-plot';
import * as _ from 'lodash';

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

  plot: LabeledBasePlot;


  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.plot = new LabeledBasePlot(
      '#pattern-plot',
      800, 300,
    );
    this.plot.setXAxisLabel('Two-Theta (°)');
    this.plot.setYAxisLabel('Intensity');
    this.throttleImageMouseMoved = _.throttle((x, y) => {
      this.mouseMoved.emit({x, y});
    }, 100);

    this.plot.mouseMoved.subscribe({
      next: ({x, y}) => {
        this.throttleImageMouseMoved(x, y);
      }
    });

    this.plot.mouseClicked.subscribe({
      next: ({x, y }) => {
        this.mouseClicked.emit({x, y});
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
