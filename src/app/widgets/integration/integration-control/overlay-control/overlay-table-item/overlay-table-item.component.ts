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
  @ViewChild('nameInput') nameInput;
  @ViewChild('colorInput') colorInput;
  color: any;
  editing = false;

  @Output() selected = new EventEmitter();


  ngOnInit(): void {
  }

  logColor(): void {
    console.log(this.colorInput.value);
  }


  doubleClicked(): void {
    this.editing = true;
    setTimeout(() => {
      this.nameInput.nativeElement.focus();
      this.nameInput.nativeElement.select();
    }, 0);
  }

  nameChanged(ev): void {
    this.overlayItem.name = ev.target.value;
    this.editing = false;
  }

}
