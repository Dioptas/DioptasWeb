import {Injectable} from '@angular/core';
import {createRandomImage} from '../lib/plotting/image-generation';

@Injectable({
  providedIn: 'root'
})
export class DataGeneratorService {

  constructor() {
  }

  get_graph(): { x: number[], y: number[] } {
    const x: number[] = [];
    const y: number[] = [];
    let xValue = 0;
    for (let i = 0; i < 1001; i++) {
      xValue = i * 0.1;
      x.push(xValue);
      y.push(xValue * xValue);
    }
    return {x, y};
  }

  getImage(width = 1024, height = 1024): Uint16Array {
    return createRandomImage(width, height);
  }
}
