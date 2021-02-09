import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {NumpyLoader} from '../lib/numpy-loader';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DioptasServerService {
  public imageData = new Subject<{ shape: any, fortran_order: boolean, data: any }>();
  public integratedPattern = new Subject<{ x: number[], y: number[] }>();
  public imageFilename = new Subject<string>();

  private socket: Socket;

  private imageServerPort: number;
  private webSocket: WebSocket;

  public imagePath = '';

  constructor() {
      this.connect();
  }

  connect(port: number = 8745): void {
    this.socket = io('127.0.0.1:' + port);
    this.socket.on('connect', () => {
      console.log(this.socket.id);
    });

    this.socket.on('img_changed', (payload) => this._imgChanged(payload));
    this.socket.on('pattern_changed', (payload) => {
      this.integratedPattern.next({x: payload.x, y: payload.y});
    });

    this.socket.emit('init_model', (serverPort) => {
      this.connectToImageServer(serverPort);
    });
    setTimeout(() => this.load_dummy_project(), 1500);
  }

  load_dummy_project(): void {
    this.socket.emit('load_dummy');
  }

  load_dummy2_project(): void {
    this.socket.emit('load_dummy2');
  }

  load_image(filename: string): void {
    this.socket.emit('load_image', filename);
    this.imagePath = filename.split('/').slice(0, -1).join('/');
  }

  load_next_image(): void {
    this.socket.emit('load_next_image');
  }

  load_previous_image(): void {
    this.socket.emit('load_previous_image');
  }

  _imgChanged(payload): void {
    this.imageFilename.next(payload.filename);
    if (!this.webSocket.OPEN) {
      this.connectToImageServer(payload.serverPort);
      this.imageServerPort = payload.serverPort;
    }
    this.webSocket.send('image');
  }

  connectToImageServer(port): void {
    this.webSocket = new WebSocket('ws://127.0.0.1:' + port);
    this.webSocket.onopen = () => {
      this.webSocket.send('image');
    };
    this.webSocket.onmessage = (event) => {
      event.data.arrayBuffer().then((val) => {
          const data = NumpyLoader.fromArrayBuffer(val);
          this.imageData.next(data);
        }
      );
    };
    this.webSocket.onclose = () => {
      console.log('Web socket connection is closed!');
    };
  }

  getDirList(path): Promise<{ folders: [], files: [] }> {
    return new Promise<{ folders: []; files: [] }>(resolve => {
      this.socket.emit('list_dir', path, (data) => {
        resolve(data);
      });
    });
  }

  getImageAngles(x: number, y: number): Promise<{ tth: number, azi: number, q: number, d: number }> {
    return new Promise<{ tth: number, azi: number, q: number, d: number }>(resolve => {
      this.socket.emit('get_image_angles', x, y, (data) => {
        resolve(data);
      });
    });
  }

  getPatternAngles(tth: number): Promise<{ tth: number, q: number, d: number }> {
    return new Promise<{ tth: number, q: number, d: number }>(resolve => {
      this.socket.emit('get_pattern_angles', tth, (data) => {
        resolve(data);
      });
    });
  }

  getAzimuthalRing(tth): Promise<{ x: [], y: [] }> {
    return new Promise<{ x: [], y: [] }>((resolve) => {
      this.socket.emit('get_azimuthal_ring', tth, (data) => {
        resolve(data);
      });
    });
  }
}
