import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-image-position',
  templateUrl: './image-position.component.html',
  styleUrls: ['./image-position.component.css']
})
export class ImagePositionComponent {
  @Input() mousePosition = {x: 0, y: 0, intensity: 0};
  @Input() clickPosition = {x: 0, y: 0, intensity: 0};
}
