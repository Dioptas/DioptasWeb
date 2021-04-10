import { Component, OnInit } from '@angular/core';
import {OverlayService} from '../../../shared/model/overlay.service';

@Component({
  selector: 'app-pattern-top-menu',
  templateUrl: './pattern-top-menu.component.html',
  styleUrls: ['./pattern-top-menu.component.scss']
})
export class PatternTopMenuComponent implements OnInit {

  constructor(public overlayService: OverlayService) { }

  ngOnInit(): void {
  }

}
