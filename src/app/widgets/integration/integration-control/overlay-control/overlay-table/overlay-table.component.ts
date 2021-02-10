import {Component, Input, OnInit} from '@angular/core';
import Overlay from '../../../../../shared/overlay';

@Component({
  selector: 'app-overlay-table',
  templateUrl: './overlay-table.component.html',
  styleUrls: ['./overlay-table.component.scss']
})
export class OverlayTableComponent implements OnInit {
  @Input() overlays: Overlay[];

  selectedOverlayIndex = 0;

  constructor() { }

  ngOnInit(): void {
  }

  overlaySelected(i: number): void {
    this.selectedOverlayIndex = i;
  }
}
