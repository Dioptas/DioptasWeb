export default interface ItemInterface {
  initialize(parent, xScale, yScale, clipPath): void;

  update(): void;
}

export class Item implements ItemInterface {
  public parent;
  public xScale;
  public yScale;

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
