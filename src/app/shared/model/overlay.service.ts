import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
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

  public overlayAdded = new Subject<OverlayInterface>();
  public overlayChanged = new Subject<{ index: number, overlay: OverlayInterface }>();
  public overlayRemoved = new Subject<number>();

  private overlays$ = [];

  constructor(public server: ServerService) {
    this.connectSioEvents();
  }

  connectSioEvents(): void {
    this.server.sioClient.on('overlay_added', (payload) => {
      this.overlays$.push(
        {
          ...payload,
          visible: true,
          color: '#24ff16'
        });
      this.overlayAdded.next(this.overlays$[this.overlays$.length - 1]);
      this.emitOverlays();
    });
    this.server.sioClient.on('overlay_changed', (payload) => {
      const index = payload.index;
      const updatedOverlay = payload.overlay;
      this.overlays$[index].name = updatedOverlay.name;
      this.overlays$[index].x = updatedOverlay.x;
      this.overlays$[index].y = updatedOverlay.y;
      this.overlays$[index].offset = updatedOverlay.offset;
      this.overlays$[index].scaling = updatedOverlay.scaling;
      this.overlayChanged.next({index, overlay: this.overlays$[index]});
      this.emitOverlays();
    });
    this.server.sioClient.on('overlay_removed', (index) => {
      this.overlays$.splice(index);
      this.overlayRemoved.next(index);
      this.emitOverlays();
    });
  }

  patternAsOverlay(): void {
    this.server.emit('pattern_as_overlay').then();
  }

  clearOverlays(): void {
    this.server.emit('clear_overlays').then();
  }

  setOverlayScaling(ind: number, scaling: number): void {
    this.server.emit('set_overlay_scaling', {ind, scaling}).then();
  }

  setOverlayOffset(ind: number, offset: number): void {
    this.server.emit('set_overlay_offset', {ind, offset}).then();
  }

  emitOverlays(): void {
    this.overlays.next(this.overlays$);
  }
}
