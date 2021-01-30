import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';

import ImagePlot from '../../../lib/plotting/image-plot';
import {DataGeneratorService} from '../../../shared/data-generator.service';
import {DioptasServerService} from '../../../shared/dioptas-server.service';
import LineItem from '../../../lib/plotting/items/lineItem';

@Component({
  selector: 'app-image-plot',
  templateUrl: './image-plot.component.html',
  styleUrls: ['./image-plot.component.css']
})
export class ImagePlotComponent implements OnInit, AfterViewInit {
  @Output() mouseMoved = new EventEmitter<{ x: number, y: number, intensity: number }>();
  @Output() mouseClicked = new EventEmitter<{ x: number, y: number, intensity: number }>();
  @ViewChild('graphContainer') graphContainer: ElementRef;
  imagePlot: ImagePlot;
  circleLineItems: LineItem[] = [];

  throttleResize;
  throttleImageMouseMoved;

  constructor(
    private dataService: DataGeneratorService,
    private dioptasServer: DioptasServerService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.imagePlot = new ImagePlot(
      '#graph',
      800, 300,
      true,
      'horizontal'
    );

    const imageWidth = 1024;
    const imageHeight = 1024;
    const image = this.dataService.getImage(imageWidth, imageHeight);

    this.imagePlot.plotImage(image, imageWidth, imageHeight);
    for (let i = 0; i < 4; i++) {
      const line = new LineItem('yellowgreen');
      this.circleLineItems.push(line);
      this.imagePlot.addItem(line);
    }


    this.throttleResize = _.throttle(() => {
      const width = this.graphContainer.nativeElement.clientWidth;
      const height = this.graphContainer.nativeElement.clientHeight;
      this.imagePlot.resize(width, height);
    }, 50);

    setTimeout(() => this.throttleResize(), 50); // for some reason this has to be delayed

    this.throttleImageMouseMoved = _.throttle((x, y, intensity) => {
      this.mouseMoved.emit({x, y, intensity});
    }, 100);

    this.dioptasServer.imageChanged.subscribe((data) => {
      this.imagePlot.plotImage(data.data, data.shape[1], data.shape[0]);
    });

    this.imagePlot.mouseMoved.subscribe({
      next: ({x, y, intensity}) => {
        this.throttleImageMouseMoved(x, y, intensity);
      }
    });

    this.imagePlot.mouseClicked.subscribe({
      next: ({x, y, intensity}) => {
        this.mouseClicked.emit({x, y, intensity});
        this.dioptasServer.getAzimuthalRing(x, y, (data) => {
          for (let i = 0; i < data.x.length; i++) {
            this.circleLineItems[i].setData(data.x[i], data.y[i]);
          }
        });
      }
    });

  }

  @HostListener('window:resize')
  onResize(): void {
    this.throttleResize();
  }

}

