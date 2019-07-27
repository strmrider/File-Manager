export class PathBarStyle {
  private _normal = { bg: "bg-normal", name: "name-normal" };
  private _selected = { bg: "bg-selected", name: "name-selected" };
  private _draggedOver = { bg: "bg-draggedover", name: "name-draggedover" };
  private _dragged = { bg: "bg-dragged", name: "name-dragged" };
  private _over = { bg: "bg-over", name: "name-over" };
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

  draggedOver() {
    this._current = this._draggedOver;
  }

  dragged() {
    this._current = this._dragged;
  }
}
