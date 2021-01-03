import {AfterViewInit, Component, ContentChild, OnInit, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-horizontal-splitter',
  templateUrl: './horizontal-splitter.component.html',
  styleUrls: ['./horizontal-splitter.component.css']
})
export class HorizontalSplitterComponent implements OnInit, AfterViewInit {
  @ContentChild('top', {read: TemplateRef}) top: TemplateRef<any>;
  @ContentChild('bottom', {read: TemplateRef}) bottom: TemplateRef<any>;

  @ViewChild('slider') slider;
  @ViewChild('topBlock') topBlock;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.slider.nativeElement.onmousedown = (mouseEvent: MouseEvent) => {
      let dragY = mouseEvent.clientY;
      document.onmousemove = (e) => {
        this.topBlock.nativeElement.style.height = this.topBlock.nativeElement.offsetHeight + e.clientY - dragY + 'px';
        dragY = e.clientY;
        window.dispatchEvent(new Event('resize'));
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };

    };
  }
}
