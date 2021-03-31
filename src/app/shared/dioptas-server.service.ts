import {Injectable} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {NumpyLoader} from '../lib/numpy-loader';
import {BehaviorSubject, Subject} from 'rxjs';
import {OverlayInterface} from './overlay';

@Injectable({
  providedIn: 'root'
})
export class DioptasServerService {
  public imageData = new Subject<{ shape: any, fortran_order: boolean, data: any }>();
  public imageFilename = new Subject<string>();
  public integratedPattern = new Subject<{ x: number[], y: number[] }>();
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

  private sioClient: Socket;
  private imageWs: WebSocket;
  private port;

  public imagePath = '';

  constructor() {
    this.connect();
  }

  connect(port: number = 8745): void {
    this.port = port;
    this.sioClient = io('127.0.0.1:' + port);
    this.sioClient.on('connect', () => {
      console.log(this.sioClient.id);
      this.sioClient.emit('init_model', () => {
        this.connectToImageServer();
      });
    });

    this.sioClient.on('img_changed', (payload) => this.imageFilename.next(payload.filename));
    this.sioClient.on('pattern_changed', (payload) => {
      this.integratedPattern.next({x: payload.x, y: payload.y});
    });
    setTimeout(() => this.load_dummy_project(), 1000);
  }

  load_dummy_project(): void {
    this.sioClient.emit('load_dummy');
  }

  load_dummy2_project(): void {
    this.sioClient.emit('load_dummy2');
  }

  load_image(filename: string): void {
    this.sioClient.emit('load_image', filename);
    this.imagePath = filename.split('/').slice(0, -1).join('/');
  }

  load_next_image(): void {
    this.sioClient.emit('load_next_image');
  }

  load_previous_image(): void {
    this.sioClient.emit('load_previous_image');
  }

  connectToImageServer(): void {
    this.imageWs = new WebSocket('ws://127.0.0.1:' + this.port + '/image');
    this.imageWs.onopen = () => {
      this.imageWs.send(this.sioClient.id);
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

  getImageAngles(x: number, y: number): Promise<{ tth: number, azi: number, q: number, d: number }> {
    return this.emit('get_image_angles', x, y);
  }

  getPatternAngles(tth: number): Promise<{ tth: number, q: number, d: number }> {
    return this.emit('get_pattern_angles', tth);
  }

  getAzimuthalRing(tth): Promise<{ x: [], y: [] }> {
    return this.emit('get_azimuthal_ring', tth);
  }
}
