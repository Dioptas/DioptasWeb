import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {OverlayInterface} from '../overlay';
import {ServerService} from './server.service';
import {generateColor} from './color';

@Injectable({
  providedIn: 'root'
})
export class OverlayService {
  public overlays = new BehaviorSubject<OverlayInterface[]>(
    []
  );

  public overlayAdded = new Subject<OverlayInterface>();
  public overlayChanged = new Subject<{ index: number, overlay: OverlayInterface }>();
  public overlayRemoved = new Subject<number>();

  private overlays$ = [];
  private colorIndex = 0;

  constructor(public server: ServerService) {
    this.connectSioEvents();
  }

  connectSioEvents(): void {
    this.server.sioClient.on('overlay_added', (payload) => {
      const color = generateColor(this.colorIndex++);
      console.log(color);
      this.overlays$.push(
        {
          ...payload,
          visible: true,
          color
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
