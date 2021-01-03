import {AfterViewInit, Component, ContentChild, OnInit, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-vertical-splitter',
  templateUrl: './vertical-splitter.component.html',
  styleUrls: ['./vertical-splitter.component.css']
})
export class VerticalSplitterComponent implements OnInit, AfterViewInit {
  @ContentChild('left', { read: TemplateRef }) left: TemplateRef<any>;
  @ContentChild('right', { read: TemplateRef }) right: TemplateRef<any>;

  @ViewChild('slider') slider;
  @ViewChild('leftBlock') leftBlock;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.slider.nativeElement.onmousedown = (mouseEvent: MouseEvent) => {
      let dragX = mouseEvent.clientX;
      document.onmousemove = (e) => {
        this.leftBlock.nativeElement.style.width = this.leftBlock.nativeElement.offsetWidth + e.clientX - dragX + 'px';
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
