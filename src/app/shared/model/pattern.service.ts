import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ServerService} from './server.service';

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  public integratedPattern = new Subject<{ x: number[], y: number[] }>();

  constructor(public server: ServerService) {
    this.server.sioClient.on('pattern_changed', (payload) => {
      this.integratedPattern.next({x: payload.x, y: payload.y});
    });
  }
}
