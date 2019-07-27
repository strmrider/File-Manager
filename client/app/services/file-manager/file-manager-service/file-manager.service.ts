import { Injectable, ElementRef, EventEmitter } from "@angular/core";
import { SystemService } from "../../system/system.service";
import { UIComponent } from "src/app/shared/enums/UIComponent";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";

@Injectable({
  providedIn: "root"
})
export class FileManagerService {
  // in which component right click was performed
  private _rightClickComponent: UIComponent;
  private _contextmenuElem: ElementRef;
  // when a nvigation tree directory is being dragged
  private _navTreeDraggedDir: Directory;
  private _currentViewdDir: Directory;

  private _readyToLoad = new EventEmitter();
  private fileDetailsDisplay = new EventEmitter();
  constructor(private system: SystemService) {
    this.system.systemReadyEmitter.subscribe(() => {
      this._readyToLoad.emit();
    });
  }

  get readyToLoad() {
    return this._readyToLoad;
  }
  get rightClickComponent() {
    return this._rightClickComponent;
  }

  set rightClickComponent(component: UIComponent) {
    this._rightClickComponent = component;
  }

  get navTreeDraggedDir() {
    return this._navTreeDraggedDir;
  }

  set navTreeDraggedDir(dir: Directory) {
    this._navTreeDraggedDir = dir;
  }

  get currentViewedDir() {
    return this._currentViewdDir;
  }

  set currentViewedDir(dir: Directory) {
    this._currentViewdDir = dir;
  }

  get contextmenuElem() {
    return this._contextmenuElem;
  }

  set contextmenuElem(element: ElementRef) {
    this._contextmenuElem = element;
  }

  get fileDetailsEmitter() {
    return this.fileDetailsDisplay;
  }

  displayFilesDetails() {
    this.fileDetailsDisplay.emit();
  }
}
