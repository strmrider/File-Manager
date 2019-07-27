import { Injectable, EventEmitter } from "@angular/core";
import { FileItem } from "src/app/shared/models/file-system/file items/file-item";

@Injectable({
  providedIn: "root"
})
export class FilePreviewService {
  private _display = new EventEmitter();
  constructor() {}

  get displayEmitter() {
    return this._display;
  }
  public display(file: FileItem) {
    this._display.emit(file);
  }
}
