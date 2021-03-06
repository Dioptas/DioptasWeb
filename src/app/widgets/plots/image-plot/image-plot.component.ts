import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from '@angular/core';
import * as _ from 'lodash';

import ImagePlot from '../../../lib/plotting/image-plot';
import {DataGeneratorService} from '../../../shared/data-generator.service';
import LineItem from '../../../lib/plotting/items/lineItem';
import {MousePositionService} from '../../../shared/mouse/mouse-position.service';
import {ImageService} from '../../../shared/model/image.service';
import {CalibrationService} from '../../../shared/model/calibration.service';

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
    private imageService: ImageService,
    private calibrationService: CalibrationService,
    private mouseService: MousePositionService) {
  }


  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.createImagePlot();
    this.initResize();
    this.initMouseEvents();
  }

  createImagePlot(): void {
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
  }

  initResize(): void {
    this.throttleResize = _.throttle(() => {
      const width = this.graphContainer.nativeElement.clientWidth;
      const height = this.graphContainer.nativeElement.clientHeight;
      this.imagePlot.resize(width, height);
    }, 50);

    setTimeout(() => this.throttleResize(), 50); // for some reason this has to be delayed
  }

  @HostListener('window:resize')
  onResize(): void {
    this.throttleResize();
  }

  initMouseEvents(): void {
    this.throttleImageMouseMoved = _.throttle((x, y, intensity) => {
      this.mouseMoved.emit({x, y, intensity});
      this.mouseService.updateImageMousePosition(x, y, intensity).then();
    }, 100);

    this.imageService.imageData.subscribe((data) => {
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
        this.mouseService.updateImageClickPosition(x, y, intensity).then();
      }
    });

    this.mouseService.anglesClicked.subscribe(async (angles) => {
      const data = await this.calibrationService.getAzimuthalRing(angles.tth);
      if (data.x) {
        for (let i = 0; i < data.x.length; i++) {
          this.circleLineItems[i].setData(data.x[i], data.y[i]);
        }
      }
    });
  }
}

