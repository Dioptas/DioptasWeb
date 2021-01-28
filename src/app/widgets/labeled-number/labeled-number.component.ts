import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-labeled-number',
  templateUrl: './labeled-number.component.html',
  styleUrls: ['./labeled-number.component.css']
})
export class LabeledNumberComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() format = '1.1-3';
}
