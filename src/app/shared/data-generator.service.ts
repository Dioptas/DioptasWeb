import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataGeneratorService {

  constructor() {
  }

  get_graph(): { x: number[], y: number[] } {
    const x: number[] = [];
    const y: number[] = [];
    let x_val = 0;
    for (let i = 0; i < 1001; i++) {
      x_val = i * 0.1;
      x.push(x_val);
      y.push(x_val * x_val);
    }
    return {x, y};
  }
}
