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

  private imageWs: WebSocket;

  constructor(public server: ServerService) {
    this.server.connected.subscribe(() => {
      console.log('init_model');
      this.server.sioClient.emit('init_model', () => {
        this.connectToImageServer();
      });
    });
    this.server.connect();

    this.server.sioClient.on('img_changed', (payload) => this.imageFilename.next(payload.filename));
  }

  connectToImageServer(): void {
    this.imageWs = new WebSocket('ws://127.0.0.1:' + this.server.port + '/image');
    this.imageWs.onopen = () => {
      this.imageWs.send(this.server.sid);
    };
    this.imageWs.onmessage = (event) => {
      if (event.data[0] === '1') {
        return;
      } else if (event.data[0] === '0') {
        console.log('Error in communication with Image WebSocket.');
        return;
      } else {
        event.data.arrayBuffer().then((val) => {
            const data = NumpyLoader.fromArrayBuffer(val);
            this.imageData.next(data);
          }
        );
      }
    };
    this.imageWs.onclose = () => {
      console.log('Web socket connection is closed!');
    };
  }

  load_image(filename: string): void {
    this.server.emit('load_image', filename).then();
    this.imagePath = filename.split('/').slice(0, -1).join('/');
  }

  load_next_image(): void {
    this.server.emit('load_next_image').then();
  }

  load_previous_image(): void {
    this.server.emit('load_previous_image').then();
  }
}
