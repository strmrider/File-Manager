/* Represents indices selection of a seperated array */
export class ItemSelector {
  private indices: boolean[] = [];
  private _isFullSelection: boolean = false;
  private _count: number = 0;
  private _lastSelected: number = -1;
  constructor(size: number) {
    for (var i = 0; i < size; i++) this.indices.push(false);
  }

  get count() {
    return this._count;
  }

  get lastSelected() {
    return this._lastSelected;
  }

  get isFullSelection() {
    return this._isFullSelection;
  }

  isSelected(index: number) {
    return this.indices[index];
  }

  select(index: number) {
    this.indices[index] = true;
    this._count++;
    this._lastSelected = index;
  }

  unselect(index: number) {
    this.indices[index] = false;
    this._count--;
    if (index == this.lastSelected) this._lastSelected = -1;
  }

  selectAll() {
    this._isFullSelection = true;
    this._count = this.indices.length;
    this._lastSelected = this._count - 1;
  }

  clear() {
    if (this._count > 0) {
      for (var i = 0; i < this.indices.length; i++) this.indices[i] = false;

      this._isFullSelection = false;
      this._count = 0;
      this._lastSelected = -1;
    }
  }

  getSelectedIndices() {
    var selected = new Array();

    for (var i = 0; i < this.indices.length; i++) {
      if (this.indices[i]) selected.push(i);
    }

    return selected;
  }
}
