import LabeledBasePlot from './labeled-base-plot';
import ItemInterface from './items/item';

export default class PatternPlot extends LabeledBasePlot {
  items: ItemInterface[] = [];

  public enableAutoRange = true;

  constructor(selector, width, height) {
    super(selector, width, height);
  }

  addItem(item: ItemInterface): void {
    this.items.push(item);
    item.dataChanged.subscribe(() => {
      this.itemDataChanged();
    });
    item.initialize(this.rootElement, this.x, this.y, this.clipPath);
  }

  removeItem(item: ItemInterface): void {
    const index = this.items.indexOf(item, 0);
    if (index > -1) {
      this.items.splice(index, 1);
    }
    item.root.remove();
  }

  itemDataChanged(): void {
    if (this.enableAutoRange) {
      const xDomain = {min: +Infinity, max: -Infinity};
      const yDomain = {min: +Infinity, max: -Infinity};
      for (const item of this.items) {
        if (item.autoRanged) {
          xDomain.min = xDomain.min > item.xRange.min ? item.xRange.min : xDomain.min;
          xDomain.max = xDomain.max < item.xRange.max ? item.xRange.max : xDomain.max;
          yDomain.min = yDomain.min > item.yRange.min ? item.yRange.min : yDomain.min;
          yDomain.max = yDomain.max < item.yRange.max ? item.yRange.max : yDomain.max;
          this.plotDomainX = [xDomain.min, xDomain.max];
          this.plotDomainY = [yDomain.min, yDomain.max];
          this.autoRange();
        }
      }
    }
  }

  _updateItems(): void {
    for (const item of this.items) {
      item.update();
    }
  }

  _update(duration: number = 0): void {
    super._update(duration);
    this._updateItems();
  }

  _updateAxisLabelPositions(): void {
    // updating the axisLabelPosition also changes the axes slightly, therefore the Items need to be updated as well
    super._updateAxisLabelPositions();
    this._updateItems();
  }

  resize(width, height): void {
    super.resize(width, height);
    this._updateItems();
  }
}
