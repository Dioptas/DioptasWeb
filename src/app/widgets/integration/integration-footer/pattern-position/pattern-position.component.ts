import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-pattern-position',
  templateUrl: './pattern-position.component.html',
  styleUrls: ['./pattern-position.component.css']
})
export class PatternPositionComponent {
  @Input() mousePosition = {x: 0, y: 0};
  @Input() clickPosition = {x: 0, y: 0};
}
