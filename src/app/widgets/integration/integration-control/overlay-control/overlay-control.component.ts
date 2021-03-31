import {Component, OnInit} from '@angular/core';
import Overlay from '../../../../shared/overlay';
import {OverlayService} from '../../../../shared/model/overlay.service';

@Component({
  selector: 'app-overlay-control',
  templateUrl: './overlay-control.component.html',
  styleUrls: ['./overlay-control.component.scss']
})
export class OverlayControlComponent implements OnInit {
  overlays: Overlay[];

  constructor(public overlayService: OverlayService) {
    this.overlayService.overlays.subscribe((overlays) => {
      this.overlays = overlays;
    });
  }

  ngOnInit(): void {
  }

}
