import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as _ from 'lodash';

import ImagePlot from '../../lib/image-plot';
import {DataGeneratorService} from '../../shared/data-generator.service';

@Component({
  selector: 'app-image-plot',
  templateUrl: './image-plot.component.html',
  styleUrls: ['./image-plot.component.css']
})
export class ImagePlotComponent implements OnInit, AfterViewInit {
  @ViewChild('graphContainer') graphContainer: ElementRef;
  imagePlot: ImagePlot;

  throttleResize;

  constructor(private dataService: DataGeneratorService) {
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


    this.throttleResize = _.throttle(() => {
      const width = this.graphContainer.nativeElement.clientWidth;
      const height = this.graphContainer.nativeElement.clientHeight;
      // this.imagePlot.resize(width, 300);
      this.imagePlot.resize(width, height);
    }, 50);

    setTimeout(() => this.throttleResize(), 50); // for some reason this has to be delayed

  }

  @HostListener('window:resize')
  onResize(): void {
    this.throttleResize();
  }
}

