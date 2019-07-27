import { Injectable } from "@angular/core";
import { FilesIconSize } from "src/app/shared/enums/files-icons-size";

@Injectable({
  providedIn: "root"
})
export class DirViewDisplayModeService {
  public _size = "-small";
  fileContainer: string;

  private _mode: {};
  private grid: {};
  private list: {};
  constructor() {
    this.setGridMode();
    this.setListMode();
    this._mode = this.grid;
    this.fileContainer = "file-item-main-container-grid";
  }

  get current() {
    return this._mode;
  }

  get size() {
    return this._size;
  }

  changeMode() {
    if (this._mode == this.grid) this._mode = this.list;
    else this._mode = this.grid;
  }

  changeSize(size: FilesIconSize) {
    if (size == FilesIconSize.Small) this._size = "-small";
    else if (size == FilesIconSize.Medium) this._size = "-medium";
    else if (size == FilesIconSize.Large) this._size = "-large";
  }

  setGridMode() {
    this.grid = {
      title: "List view",
      modeIcon: "fas fa-th-list",
      container: "dir-content-container-grid",
      fileContainer: "file-item-container-grid",
      imgContainer: "file-image-container-grid",
      img: "file-item-img-grid",
      video: "file-item-video-grid",
      name: "file-item-name-grid",
      starred: "file-item-starred-grid",
      time: "file-item-time-grid",
      size: "file-item-size-grid"
    };
  }

  setListMode() {
    this.list = {
      title: "Grid view",
      modeIcon: "fas fa-th",
      container: "dir-content-container-list",
      fileContainer: "file-item-container-list",
      imgContainer: "file-image-container-list",
      img: "file-item-img-list",
      video: "file-item-video-list",
      name: "file-item-name-list",
      starred: "file-item-starred-list",
      time: "file-item-time-list",
      size: "file-item-size-list"
    };
  }
}
