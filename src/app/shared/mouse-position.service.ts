import {EventEmitter, Injectable, Output} from '@angular/core';
import {DioptasServerService} from './dioptas-server.service';

@Injectable({
  providedIn: 'root'
})
export class MousePositionService {
  /**
   * Used for communication of mouse position between image and pattern plot. It further
   * automatically updates calculated angles from mouse position
   */
  @Output() imageMouseMoved = new EventEmitter<{ x: number, y: number, intensity: number }>();
  @Output() imageMouseClicked = new EventEmitter<{ x: number, y: number, intensity: number }>();
  @Output() patternMouseMoved = new EventEmitter<{ x: number, y: number }>();
  @Output() patternMouseClicked = new EventEmitter<{ x: number, y: number }>();

  @Output() angles = new EventEmitter<{ tth: 0, azi: 0, q: 0, d: 0 }>();
  @Output() anglesClicked = new EventEmitter<{ tth: 0, azi: 0, q: 0, d: 0 }>();

  patternMousePosition = {x: 0, y: 0};
  patternClickPosition = {x: 0, y: 0};
  imageMousePosition = {x: 0, y: 0, intensity: 0};
  imageClickPosition = {x: 0, y: 0, intensity: 0};

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
    this.imageMousePosition = {x, y, intensity};
    this.imageMouseMoved.emit({x, y, intensity});
    this.dioptasService.getImageAngles(x, y, (data) => {
      this.angles.emit(data);
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
    this.imageClickPosition = {x, y, intensity};
    this.imageMouseClicked.emit({x, y, intensity});
    this.dioptasService.getImageAngles(x, y, (data) => {
      this.anglesClicked.emit(data);
    });
  }

  /**
   * Updates the pattern mouse position and calculates angles accordingly
   * Emits the patternMouseMoved and angles signals automatically
   * @param x - position in x
   * @param y - position in y
   */
  updatePatternMousePosition(x, y): void {
    this.patternMousePosition = {x, y};
    this.patternMouseMoved.emit({x, y});
    this.dioptasService.getPatternAngles(x, (data) => {
      this.angles.emit(data);
    });
  }

  /**
   * Updates the pattern clicked mouse position and calculates angles accordingly
   * Emits the patternMouseClicked and anglesClicked Signal
   * @param x - position in x
   * @param y - position in y
   */
  updatePatternClickPosition(x, y): void {
    this.patternClickPosition = {x, y};
    this.patternMouseClicked.emit({x, y});
    this.dioptasService.getPatternAngles(x, (data) => {
      this.anglesClicked.emit(data);
    });
  }
}
