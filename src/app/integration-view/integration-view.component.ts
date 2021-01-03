import {Component, OnInit, Input, AfterViewInit, HostListener, ViewChild} from '@angular/core';

@Component({
  selector: 'app-integration-view',
  templateUrl: './integration-view.component.html',
  styleUrls: ['./integration-view.component.css']
})
export class IntegrationViewComponent implements OnInit, AfterViewInit {
  @ViewChild('container') container;
  @ViewChild('slider') slider;
  @ViewChild('block1') block1;

  height: number;

  @HostListener('window:resize', ['$event'])
  onResize(_: any): void {
    this.height = this.container.nativeElement.clientHeight;
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.height = this.container.nativeElement.clientHeight;
    this.slider.nativeElement.onmousedown = (mouseEvent: MouseEvent) => {
      let dragX = mouseEvent.clientX;
      document.onmousemove = (e) => {
        this.block1.nativeElement.style.width = this.block1.nativeElement.offsetWidth + e.clientX - dragX + 'px';
        dragX = e.clientX;
        window.dispatchEvent(new Event('resize'));
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };

    };
  }
}
