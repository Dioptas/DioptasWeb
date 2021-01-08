import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class DioptasServerService {
  private socket: Socket;

  constructor() {
    this.connect();
  }

  connect(port: number = 8745): void {
    this.socket = io('127.0.0.1:8745');
    this.socket.on('connect', () => {
      console.log(this.socket.id);
    });

    this.socket.on('img_changed', (payload) => this.img_changed(payload));

    this.socket.emit('init_model');
    this.load_dummy_model();
  }

  load_dummy_model(): void {
    this.socket.emit('load_dummy')
  }

  img_changed(payload): void {
    console.log('image received');
    console.log(payload);
  }

}
