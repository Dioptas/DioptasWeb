import * as d3 from 'd3';
import {Subject} from 'rxjs';

export default class BrushY {
  brush;
  brushElement;
  brushEnded = new Subject();

  constructor(parent, extentX, extentY, position, clipPath, private orientation = 'vertical') {
    if (orientation === 'vertical') {
      this.brush = d3.brushY().extent([extentX, extentY]);
    } else {
      this.brush = d3.brushX().extent([extentX, extentY]);
    }

    this.brushElement = parent
      .append('g')
      .attr('class', 'brush')
      .attr('clip-path', clipPath)
      .call(this.brush)
      .call(this.brush.move, position);
    this._activateEvents();
  }

  resize(extentX, extentY): void {
    this.brush.extent([extentX, extentY]);
  }

  select(range, silent = true): void {
    if (silent) {
      this._deactivateEvents();
    }
    this.brushElement.call(this.brush).call(this.brush.move, range);
    if (silent) {
      this._activateEvents();
    }
  }

  _activateEvents(): void {
    this.brush.on('brush end', (event) => {
      if (this.orientation === 'vertical') {
        this.brushEnded.next([event.selection[1], event.selection[0]]);
      } else {
        this.brushEnded.next([event.selection[0], event.selection[1]]);
      }
    });
  }

  _deactivateEvents(): void {
    this.brush.on('brush end', null); // remove listener
  }
}
