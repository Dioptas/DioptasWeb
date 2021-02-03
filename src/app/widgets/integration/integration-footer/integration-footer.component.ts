import {Component} from '@angular/core';
import {DioptasServerService} from '../../../shared/dioptas-server.service';
import {MousePositionService} from '../../../shared/mouse-position.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-integration-footer',
  templateUrl: './integration-footer.component.html',
  styleUrls: ['./integration-footer.component.css']
})
export class IntegrationFooterComponent {
  patternMousePosition: Observable<{ x: number; y: number }>;
  patternClickPosition: Observable<{ x: number; y: number }>;
  imageMousePosition: Observable<{ x: number; y: number; intensity: number }>;
  imageClickPosition: Observable<{ x: number; y: number; intensity: number }>;

  angles: Observable<{ tth: number, azi: number, q: number, d: number }>;
  clickAngles: Observable<{ tth: number, azi: number, q: number, d: number }>;

  constructor(
    private dioptasService: DioptasServerService,
    private mouseService: MousePositionService) {

    this.imageMousePosition = this.mouseService.imageMousePosition.asObservable();
    this.imageClickPosition = this.mouseService.imageClickPosition.asObservable();
    this.patternMousePosition = this.mouseService.patternMousePosition.asObservable();
    this.patternClickPosition = this.mouseService.patternClickPosition.asObservable();
    this.angles = this.mouseService.angles.asObservable();
    this.clickAngles = this.mouseService.anglesClicked.asObservable();
  }
}
