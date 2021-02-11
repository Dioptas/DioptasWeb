import {Component, OnInit} from '@angular/core';
import {DioptasServerService} from '../../../../shared/dioptas-server.service';
import Overlay from '../../../../shared/overlay';

@Component({
  selector: 'app-overlay-control',
  templateUrl: './overlay-control.component.html',
  styleUrls: ['./overlay-control.component.scss']
})
export class OverlayControlComponent implements OnInit {
  overlays: Overlay[];

  constructor(public dioptasService: DioptasServerService) {
    this.dioptasService.overlays.subscribe((overlays) => {
      this.overlays = overlays;
    });
  }

  ngOnInit(): void {
  }

}
