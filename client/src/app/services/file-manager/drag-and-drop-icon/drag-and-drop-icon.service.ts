import { Injectable, EventEmitter } from "@angular/core";
import { UIComponent } from "src/app/shared/enums/UIComponent";

@Injectable({
  providedIn: "root"
})
export class DragAndDropIconService {
  public display = {
    container: false,
    dirView: false,
    navTree: false
  };

  public filesDragMark = new EventEmitter();
  public handleDragEmitter = new EventEmitter();
  public cleanDragStats = new EventEmitter();

  private _mouseDown = false;
  // the component where the dragging is taking place in
  private _component: UIComponent;
  private _dragData: any;
  private onDrag = false;

  constructor() {}

  setMouseDown(dragData: any, component: UIComponent) {
    this._mouseDown = true;
    this._dragData = dragData;
    this._component = component;
  }

  setMouseUp() {
    this._mouseDown = false;
    this._dragData = null;
  }

  get mouseDown() {
    return this._mouseDown;
  }

  get isDragged() {
    return this.onDrag;
  }

  set drag(status: boolean) {
    this.onDrag = status;
    this.filesDragMark.emit(status);
    if (!status) this._component = null;
  }

  get dragData() {
    return this._dragData;
  }

  get component() {
    return this._component;
  }

  handleDrag(event) {
    this.handleDragEmitter.emit(event);
  }

  endDrag() {
    this.cleanDragStats.emit();
  }

  displayIcon() {
    this.display.container = true;
    if (this.component == UIComponent.DirView) this.display.dirView = true;
    else if (this.component == UIComponent.NavigationTree)
      this.display.navTree = true;
  }

  hide() {
    this.display.container = false;
    this.display.dirView = false;
    this.display.navTree = false;
  }

  // unmark the previous Nav Tree selecetd folder as undragged
  unmarkNavTreeSelection() {
    if (this.component == UIComponent.NavigationTree)
      this.filesDragMark.emit(false);
  }
}
