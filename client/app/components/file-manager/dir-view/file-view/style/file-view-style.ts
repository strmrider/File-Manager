export class FileViewStyle {
  private _normal = {
    bg: "bg-normal",
    media: "media-normal",
    name: "name-normal"
  };
  private _over = {
    bg: "bg-over",
    media: "media-over",
    name: "name-over"
  };
  private _selected = {
    bg: "bg-selected",
    media: "media-selected",
    name: "name-selected"
  };

  private _dragged = {
    bg: "bg-dragged",
    media: "media-dragged",
    name: "name-dragged"
  };

  private _draggedOver = {
    bg: "bg-draggedOver",
    media: "media-draggedOver",
    name: "name-draggedOver"
  };
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

  dragged() {
    this._current = this._dragged;
  }

  draggedOver() {
    this._current = this._draggedOver;
  }
}
