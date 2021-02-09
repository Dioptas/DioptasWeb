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
  async updateImageMousePosition(x, y, intensity = 0): Promise<any> {
    this.imageMousePosition.next({x, y, intensity});
    const newAngles = await this.dioptasService.getImageAngles(x, y);
    this.angles.next(newAngles);
  }

  /**
   * Updates the image clicked mouse position and calculates angles accordingly
   * Emits the imageMouseClicked and anglesClicked signals automatically
   * @param x - position in x
   * @param y - position in y
   * @param intensity - intensity of pixel at position x,y
   */
  async updateImageClickPosition(x, y, intensity: number = 0): Promise<any> {
    this.imageClickPosition.next({x, y, intensity});
    const newAngles = await this.dioptasService.getImageAngles(x, y);
    this.anglesClicked.next(newAngles);
  }

  /**
   * Updates the pattern mouse position and calculates angles accordingly
   * Emits the patternMouseMoved and angles signals automatically
   * @param x - position in x
   * @param y - position in y
   */
  async updatePatternMousePosition(x, y): Promise<any> {
    this.patternMousePosition.next({x, y});
    const newAngles = await this.dioptasService.getPatternAngles(x);
    this.angles.next({...newAngles, azi: null});
  }

  /**
   * Updates the pattern clicked mouse position and calculates angles accordingly
   * Emits the patternMouseClicked and anglesClicked Signal
   * @param x - position in x
   * @param y - position in y
   */
  async updatePatternClickPosition(x, y): Promise<any> {
    this.patternClickPosition.next({x, y});
    const newAngles = await  this.dioptasService.getPatternAngles(x);
    this.anglesClicked.next({...newAngles, azi: null});
  }
}
