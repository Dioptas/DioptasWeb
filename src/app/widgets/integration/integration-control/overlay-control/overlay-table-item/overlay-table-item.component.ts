import {Component, Input, Output, OnInit, ViewChild, EventEmitter} from '@angular/core';
import Overlay from '../../../../../shared/overlay';

@Component({
  selector: 'app-overlay-table-item',
  templateUrl: './overlay-table-item.component.html',
  styleUrls: ['./overlay-table-item.component.scss']
})
export class OverlayTableItemComponent implements OnInit {
  @Input() overlayItem: Overlay;
  @Input() highlighted: boolean;
  @Input() scaleStep = 0.1;
  @Input() offsetStep = 100;
  @ViewChild('nameInput') nameInput;
  @ViewChild('colorInput') colorInput;
  color: any;

  @Output() selected = new EventEmitter();


  ngOnInit(): void {
  }

  logColor(): void {
    console.log(this.colorInput.value);
  }
}
