import {Injectable, EventEmitter, Output} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {NumpyLoader} from '../lib/numpy-loader';

@Injectable({
  providedIn: 'root'
})
export class DioptasServerService {
  @Output() imageChanged = new EventEmitter<{ shape: any, fortran_order: boolean, data: any }>();
  @Output() imageFileNameChanged = new EventEmitter<string>();
  @Output() patternChanged = new EventEmitter<{ x: number[], y: number[] }>();

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
      this.patternChanged.emit({x: payload.x, y: payload.y});
    });

    this.socket.emit('init_model', (serverPort) => {
      console.log('init_model');
      this.connectToImageServer(serverPort);
    });
    setTimeout(() => this.load_dummy_model(), 1500);
  }

  load_dummy_model(): void {
    this.socket.emit('load_dummy');
  }

  load_dummy2_model(): void {
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
    this.imageFileNameChanged.emit(payload.filename);
    if (!this.webSocket.OPEN) {
      this.connectToImageServer(payload.serverPort);
      this.imageServerPort = payload.serverPort;
    }
    this.webSocket.send('image');
  }

  _patternChanged(payload): void {
    console.log(payload);
  }

  connectToImageServer(port): void {
    this.webSocket = new WebSocket('ws://127.0.0.1:' + port);
    this.webSocket.onopen = () => {
      this.webSocket.send('image');
    };
    this.webSocket.onmessage = (event) => {
      event.data.arrayBuffer().then((val) => {
          const data = NumpyLoader.fromArrayBuffer(val);
          this.imageChanged.emit(data);
        }
      );
    };
    this.webSocket.onclose = () => {
      console.log('Web socket connection is closed!');
    };
  }

  getDirList(path, callback: (data) => any): void {
    this.socket.emit('list_dir', path, (data) => {
      callback(data);
    });
  }

  getImageAngles(x: number, y: number, callback: (data) => any): void {
    this.socket.emit('get_image_angles', x, y, (data) => {
      callback(data);
    });
  }
}
