import {Injectable, EventEmitter, Output} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {NumpyLoader} from '../lib/numpy-loader';

@Injectable({
  providedIn: 'root'
})
export class DioptasServerService {
  @Output() imageChanged = new EventEmitter<{ shape: any, fortran_order: boolean, data: any }>();

  private socket: Socket;

  private imageServerPort: number;
  private webSocket: WebSocket;

  constructor() {
    this.connect();
  }

  connect(port: number = 8745): void {
    this.socket = io('127.0.0.1:8745');
    this.socket.on('connect', () => {
      console.log(this.socket.id);
    });

    this.socket.on('img_changed', (payload) => this.img_changed(payload));

    this.socket.emit('init_model', (serverPort) => {
      console.log('init_model');
      this.connectToImageServer(serverPort);
    });
    setTimeout(() => this.load_dummy_model(), 1500);
  }

  load_dummy_model(): void {
    this.socket.emit('load_dummy');
  }

  img_changed(payload): void {
    console.log('image received');
    console.log(payload);
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
      const arrayBuffer = event.data.arrayBuffer().then((val) => {
          const data = NumpyLoader.fromArrayBuffer(val);
          this.imageChanged.emit(data);
        }
      );
    };
    this.webSocket.onclose = () => {
      console.log('Web socket connection is closed!');
    };
  }

}
