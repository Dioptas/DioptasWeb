import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {OverlayInterface} from '../overlay';
import {ServerService} from './server.service';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  public overlays = new BehaviorSubject<OverlayInterface[]>(
    [
      {
        name: 'Herbert',
        x: [0, 5, 10, 15, 20, 25, 40],
        y: [0, 100, 1000, 150, 2000, 5000, 3500],
        visible: true,
        color: '#ed1212',
        scaling: 1,
        offset: 0
      },
      {
        name: 'Tante Frida',
        x: [0, 5, 10, 15, 20, 25],
        y: [0, 300, 740, 450, 3000, -500],
        visible: true,
        color: '#24ff16',
        scaling: 2,
        offset: 100
      }]
  );

  constructor(public server: ServerService) {
  }
}
