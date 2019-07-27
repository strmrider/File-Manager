import { Injectable, EventEmitter, ElementRef } from "@angular/core";
import { FileItemMenuService } from "../menus/file-item-menu/file-item-menu.service";
import { DirViewBackgroundMenuService } from "../menus/dir-view-background-menu/dir-view-background-menu.service";
import { TrashItemMenuService } from "../menus/trash-item-menu/trash-item-menu.service";
import { FileManagerService } from "../../file-manager/file-manager-service/file-manager.service";

@Injectable({
  providedIn: "root"
})
export class ContextmenuService {
  public container: ElementRef;
  private _visibility = false;
  private _x: string;
  private _y: string;
  public currentMenu;
  constructor(
    private fileItemMenu: FileItemMenuService,
    private backgroundMenu: DirViewBackgroundMenuService,
    private trashMenu: TrashItemMenuService
  ) {
    this.close();
  }

  get fileItem() {
    return this.fileItemMenu;
  }

  get background() {
    return this.backgroundMenu;
  }

  get visibility() {
    return this._visibility;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  showNavTreeItemMenu(x, y, unstarred = false) {
    this.showFileItemMenu(x, y, true, unstarred);
  }

  showFileItemMenu(x, y, dir = false, unstarred = false) {
    this.currentMenu = this.fileItemMenu;
    this.setPosition(x, y);
    this.fileItemMenu.display(dir, unstarred);
  }

  showBackgroundMenu(x, y) {
    this.currentMenu = this.backgroundMenu;
    this.setPosition(x, y);
    this.backgroundMenu.status = true;
  }

  showTrashMenu(x, y) {
    this.currentMenu = this.trashMenu;
    this.setPosition(x, y);

    this.trashMenu.status = true;
  }

  showFilePreviewMenu(x, y, unstarred = false) {
    this.setPosition(x, y);
    this._visibility = true;
    this.fileItemMenu.filePreviewMenu(unstarred);
  }

  // being closed by window mousedown
  close() {
    this._visibility = false;
    this.fileItemMenu.status = false;
    this.backgroundMenu.status = false;
    this.trashMenu.status = false;
  }

  private adjustToBoundaries(x, y) {
    let totalHeight = this.currentMenu.fullHeight;
    let menu = this.container.nativeElement.getBoundingClientRect();
    let width = x;
    let height = y;
    let right = x + menu.width;
    let bottom = y + totalHeight;
    if (right >= window.innerWidth) {
      width = x - menu.width;
    }
    if (bottom >= window.innerHeight) {
      height = y - totalHeight;
    }
    this._x = width + "px";
    this._y = height + "px";
  }

  private setPosition(x, y) {
    this._visibility = true;
    this.adjustToBoundaries(x, y);
  }
}
