import {Injectable} from '@angular/core';
import {DioptasServerService} from './dioptas-server.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MousePositionService {
  /**
   * Used for communication of mouse position between image and pattern plot. It further
   * automatically updates calculated angles from mouse position
   */
  imageMousePosition = new BehaviorSubject<{ x: number, y: number, intensity: number }>({x: 0, y: 0, intensity: 0});
  imageClickPosition = new BehaviorSubject<{ x: number, y: number, intensity: number }>({x: 0, y: 0, intensity: 0});
  patternMousePosition = new BehaviorSubject<{ x: number, y: number }>({x: 0, y: 0});
  patternClickPosition = new BehaviorSubject<{ x: number, y: number }>({x: 0, y: 0});

  angles = new BehaviorSubject<{ tth: number, azi: number, q: number, d: number }>({tth: 0, azi: 0, q: 0, d: 0});
  anglesClicked = new BehaviorSubject<{ tth: number, azi: number, q: number, d: number }>({tth: 5, azi: 0, q: 0, d: 0});

  constructor(private dioptasService: DioptasServerService) {
  }

  /**
   * Updates the image mouse position and calculates angles accordingly
   * Emits the imageMouseMoved and angles signals automatically
   * @param x - position in x
   * @param y - position in y
   * @param intensity - intensity of pixel at position x, y
   */
  updateImageMousePosition(x, y, intensity = 0): void {
    this.imageMousePosition.next({x, y, intensity});
    this.dioptasService.getImageAngles(x, y, (data) => {
      this.angles.next(data);
    });
  }

  /**
   * Updates the image clicked mouse position and calculates angles accordingly
   * Emits the imageMouseClicked and anglesClicked signals automatically
   * @param x - position in x
   * @param y - position in y
   * @param intensity - intensity of pixel at position x,y
   */
  updateImageClickPosition(x, y, intensity: number = 0): void {
    this.imageClickPosition.next({x, y, intensity});
    this.dioptasService.getImageAngles(x, y, (data) => {
      this.anglesClicked.next(data);
    });
  }

  /**
   * Updates the pattern mouse position and calculates angles accordingly
   * Emits the patternMouseMoved and angles signals automatically
   * @param x - position in x
   * @param y - position in y
   */
  updatePatternMousePosition(x, y): void {
    this.patternMousePosition.next({x, y});
    this.dioptasService.getPatternAngles(x, (data) => {
      this.angles.next(data);
    });
  }

  /**
   * Updates the pattern clicked mouse position and calculates angles accordingly
   * Emits the patternMouseClicked and anglesClicked Signal
   * @param x - position in x
   * @param y - position in y
   */
  updatePatternClickPosition(x, y): void {
    this.patternClickPosition.next({x, y});
    this.dioptasService.getPatternAngles(x, (data) => {
      this.anglesClicked.next(data);
    });
  }
}
