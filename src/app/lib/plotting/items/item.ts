import {Subject} from 'rxjs';
import * as d3 from 'd3';

export default interface ItemInterface {
  autoRanged: boolean;
  dataChanged: Subject<[]>;

  xRange: { min: number, max: number };
  yRange: { min: number, max: number };

  root: d3.Selection<any, any, any, any>;

  initialize(parent, xScale, yScale, clipPath): void;

  update(): void;
}

export class Item implements ItemInterface {
  public autoRanged = false;
  public dataChanged = new Subject<[]>();
  public parent;
  public xScale;
  public yScale;

  public xRange = {min: 0, max: 0};
  public yRange = {min: 0, max: 0};

  public root;
  private clipPath;

  initialize(parent, xScale, yScale, clipPath): void {
    this.parent = parent;
    this.xScale = xScale;
    this.yScale = yScale;
    this.clipPath = clipPath;
    this.root = this.parent.append('g')
      .attr('clip-path', 'url(#' + clipPath + ')');
  }

  update(): void {
  }
}
