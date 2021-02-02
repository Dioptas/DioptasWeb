import {Component, Input} from '@angular/core';
import {DioptasServerService} from '../../../shared/dioptas-server.service';
import {MousePositionService} from '../../../shared/mouse-position.service';

@Component({
  selector: 'app-integration-footer',
  templateUrl: './integration-footer.component.html',
  styleUrls: ['./integration-footer.component.css']
})
export class IntegrationFooterComponent {
  @Input() patternMousePosition = {x: 0, y: 0};
  @Input() patternClickPosition = {x: 0, y: 0};
  @Input() imageMousePosition = {x: 0, y: 0, intensity: 0};
  @Input() imageClickPosition = {x: 0, y: 0, intensity: 0};

  @Input() angles = {tth: 0, azi: 0, q: 0, d: 0};
  @Input() clickAngles = {tth: 0, azi: 0, q: 0, d: 0};

  constructor(
    private dioptasService: DioptasServerService,
    private mouseService: MousePositionService) {

    this.mouseService.imageMouseMoved.subscribe((data) => this.imageMousePosition = data);
    this.mouseService.imageMouseClicked.subscribe((data) => this.imageClickPosition = data);
    this.mouseService.angles.subscribe((data) => this.angles = data);
    this.mouseService.anglesClicked.subscribe((data) => this.clickAngles = data);
    this.mouseService.patternMouseMoved.subscribe((data) => this.patternMousePosition = data);
    this.mouseService.patternMouseClicked.subscribe((data) => this.patternClickPosition = data);
  }
}
