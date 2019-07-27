import { NavTreeStyle } from "./nav-tree-style";

export class DirTreeStyle extends NavTreeStyle {
  private _toggle = {
    status: false,
    main_closed: "fas fa-folder",
    main_open: "fas fa-folder-open",
    closed: "far fa-folder",
    open: "far fa-folder-open"
  };
  constructor() {
    super();
  }

  toggle(main = false) {
    if (main) {
      if (this._toggle.status) return this._toggle.main_open;
      else return this._toggle.main_closed;
    } else {
      if (this._toggle.status) return this._toggle.open;
      else return this._toggle.closed;
    }
  }

  setToggle(status: boolean) {
    this._toggle.status = status;
  }
}
