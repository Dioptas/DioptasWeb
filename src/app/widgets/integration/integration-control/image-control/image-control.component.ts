import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-control',
  templateUrl: './image-control.component.html',
  styleUrls: ['./image-control.component.css']
})
export class ImageControlComponent implements OnInit {
  browseMode = 'name';
  batchMode = 'integrate';

  constructor() { }

  ngOnInit(): void {
  }

}
