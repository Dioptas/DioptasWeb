import {Component, OnChanges, Input, SimpleChanges} from '@angular/core';
import {DioptasServerService} from '../../../shared/dioptas-server.service';

@Component({
  selector: 'app-integration-footer',
  templateUrl: './integration-footer.component.html',
  styleUrls: ['./integration-footer.component.css']
})
export class IntegrationFooterComponent implements OnChanges {
  @Input() patternMousePosition = {x: 0, y: 0};
  @Input() patternClickPosition = {x: 0, y: 0};
  @Input() imageMousePosition = {x: 0, y: 0, intensity: 0};
  @Input() imageClickPosition = {x: 0, y: 0, intensity: 0};

  angles = {tth: 0, azi: 0, q: 0, d: 0};
  anglesClicked = {tth: 0, azi: 0, q: 0, d: 0};

  constructor(private dioptasService: DioptasServerService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.imageMousePosition !== undefined) {
      const newPosition = changes.imageMousePosition.currentValue;
      this.dioptasService.getImageAngles(newPosition.x, newPosition.y, (data) => {
        this.angles = data;
      });
    } else if (changes.imageClickPosition !== undefined) {
      const newPosition = changes.imageClickPosition.currentValue;
      this.dioptasService.getImageAngles(newPosition.x, newPosition.y, (data) => {
        this.anglesClicked = data;
      });
    } else if (changes.patternMousePosition !== undefined) {
      const newPosition = changes.patternMousePosition.currentValue;
      this.dioptasService.getPatternAngles(newPosition.x, (data) => {
        this.angles = data;
      });
    } else if (changes.patternClickPosition !== undefined) {
      this.patternClickPosition = this.patternMousePosition;
      this.dioptasService.getPatternAngles(this.patternClickPosition.x, (data) => {
        this.anglesClicked = data;
      });
    }
  }
}
