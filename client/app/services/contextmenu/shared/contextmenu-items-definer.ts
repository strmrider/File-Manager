export abstract class ContextMenuDataDefiner {
  protected _items: Array<any>;
  protected _status = false;
  private height: number;
  constructor() {
    this.setItems();
    this.calHeight();
  }

  get items() {
    return this._items;
  }

  get status() {
    return this._status;
  }

  set status(value: boolean) {
    this._status = value;
  }

  public get numberOFItems() {
    return this.items.length;
  }

  public get fullHeight() {
    return this.height;
  }

  protected abstract setItems();

  protected setItem(
    text: string,
    imgSrc: string = "",
    exeFunc: Function = function() {
      console.log("Default execution function");
    }
  ) {
    return { text: text, icon: imgSrc, execution: exeFunc, visibility: true };
  }

  private calHeight() {
    // depends on css heights per item and total paddings
    var height = 10; // total padding
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].text != "hr/") height += 30;
      else height += 15;
    }
    return (this.height = height);
  }
}
