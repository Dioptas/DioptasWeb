import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  public connected = new Subject();
  public port;

  public sioClient: Socket;
  public sid: string;

  constructor() {
  }

  connect(port: number = 8745): void {
    this.port = port;
    this.sioClient = io('127.0.0.1:' + port);
    this.sioClient.on('connect', () => {
      this.sid = this.sioClient.id;
      this.connected.next();
      console.log(this.sioClient.id);
    });
    setTimeout(() => this.load_dummy_project(), 1000);
  }

  emit(event: string, ...args: any): Promise<any> {
    return new Promise<any>(resolve => {
      this.sioClient.emit(event, ...args, (data) => {
        resolve(data);
      });
    });
  }

  getDirList(path): Promise<{ folders: [], files: [] }> {
    return this.emit('list_dir', path);
  }


  load_dummy_project(): void {
    this.sioClient.emit('load_dummy');
  }

  load_dummy2_project(): void {
    this.sioClient.emit('load_dummy2');
  }
}
