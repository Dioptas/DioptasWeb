import {Injectable} from '@angular/core';
import {ServerService} from './server.service';
import {NumpyLoader} from '../../lib/numpy-loader';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public imageData = new Subject<{ shape: any, fortran_order: boolean, data: any }>();
  public imageFilename = new Subject<string>();
  public imagePath = '';
  public t1 = new Date();

  constructor(public server: ServerService) {
    this.server.connected.subscribe(() => {
      console.log('init_model');
      this.server.sioClient.emit('init_model' );
    });
    this.server.connect();

    this.server.sioClient.on('img_changed', (payload) => {
      const t2 = new Date();
      // @ts-ignore
      console.log('Time necessary: ', t2 - this.t1);
      this.imageFilename.next(payload.filename);
      const data = NumpyLoader.fromArrayBuffer(payload.image);
      this.imageData.next(data);
    });
  }

  load_image(filename: string): void {
    this.server.emit('load_image', filename).then();
    this.imagePath = filename.split('/').slice(0, -1).join('/');
  }

  load_next_image(): void {
    this.server.emit('load_next_image').then();
    this.t1 = new Date();
  }

  load_previous_image(): void {
    this.server.emit('load_previous_image').then();
    this.t1 = new Date();
  }
}
