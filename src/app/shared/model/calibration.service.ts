import { Injectable } from '@angular/core';
import {ServerService} from './server.service';

@Injectable({
  providedIn: 'root'
})
export class CalibrationService {

  constructor(private server: ServerService) { }

  getImageAngles(x: number, y: number): Promise<{ tth: number, azi: number, q: number, d: number }> {
    return this.server.emit('get_image_angles', x, y).then();
  }

  getPatternAngles(tth: number): Promise<{ tth: number, q: number, d: number }> {
    return this.server.emit('get_pattern_angles', tth).then();
  }

  getAzimuthalRing(tth): Promise<{ x: [], y: [] }> {
    return this.server.emit('get_azimuthal_ring', tth).then();
  }
}
