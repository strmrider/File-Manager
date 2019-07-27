export class MoveModalItemSelectionStyle {
  private _normal = { bg: "bg-normal" };
  private _selected = { bg: "bg-selected" };
  private _over = { bg: "bg-over" };
  private _disabled = { bg: "bg-disabled" };
  private _current = this._normal;
  constructor() {}

  get current() {
    return this._current;
  }

  normal() {
    this._current = this._normal;
  }

  selected() {
    this._current = this._selected;
  }

  over() {
    this._current = this._over;
  }

  disabled() {
    this._current = this._disabled;
  }
}
