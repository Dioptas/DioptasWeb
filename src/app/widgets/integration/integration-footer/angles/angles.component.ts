import { Component, Input} from '@angular/core';

@Component({
  selector: 'app-angles',
  templateUrl: './angles.component.html',
  styleUrls: ['./angles.component.css']
})
export class AnglesComponent{
  @Input() angles = {tth: 0, azi: 0, q: 0, d: 0};
  @Input() clickAngles = {tth: 0, azi: 0, q: 0, d: 0};

}
