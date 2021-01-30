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
    item.initialize(this.rootElement, this.x, this.y, this.clipPath);
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

  resize(width, height): void {
    super.resize(width, height);
    this._updateItems();
  }
}
