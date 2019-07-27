import { Injectable, EventEmitter } from "@angular/core";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { UIComponent } from "src/app/shared/enums/UIComponent";
import { FileType } from "src/app/shared/enums/file-type";
import { SystemService } from "../../system/system.service";
import { TasksService } from "../../tasks/tasks-service/tasks.service";
import { FileManagerService } from "../file-manager-service/file-manager.service";
import { DirViewService } from "../dir-view/dir-view-service/dir-view.service";
import { DragAndDropIconService } from "../drag-and-drop-icon/drag-and-drop-icon.service";

@Injectable({
  providedIn: "root"
})
export class NavTreeService {
  public unselectPrevious = new EventEmitter();
  public unselectRightClicked = new EventEmitter();
  public dragSelected = new EventEmitter();

  private _pressedDir: Directory;
  private _rightClickedDir: Directory;
  private isMainToggled: boolean = false;
  constructor(
    private system: SystemService,
    private tasks: TasksService,
    private fileManager: FileManagerService,
    private dirView: DirViewService,
    private dragAndDrop: DragAndDropIconService
  ) {
    this.pressedDir = this.mainDir;
  }

  get mainToggled() {
    return this.isMainToggled;
  }
  get mainDir() {
    return this.system.fileSystem.main;
  }

  get trash() {
    return this.system.fileSystem.trash;
  }

  get shared() {
    return this.system.fileSystem.shared;
  }

  get starred() {
    return this.system.fileSystem.starred;
  }

  set mainToggle(status) {
    this.isMainToggled = status;
  }

  // if current dir is open at dirView component
  isOpen(dir: Directory) {
    return this.dirView.currentDir.id == dir.id;
  }

  dropFiles(target: Directory) {
    var files;
    var source;
    if (this.dragAndDrop.component == UIComponent.DirView) {
      files = this.dirView.selectedFiles;
      source = this.dirView.currentDir;
    } else {
      files = [this._pressedDir];
      source = this._pressedDir.parent;
    }
    this.tasks.moveFiles(target, source, files);
  }

  systemFoldersOperations(sysDir: Directory) {
    if (sysDir.type == FileType.Trash)
      this.tasks.removeFiles(this.dirView.selectedFiles);
  }

  set pressedDir(dir: Directory) {
    this.fileManager.navTreeDraggedDir = dir;
    this._pressedDir = dir;
  }

  get pressedDir() {
    return this._pressedDir;
  }

  get rightClickedDir() {
    return this._rightClickedDir;
  }

  set rightClickedDir(dir: Directory) {
    this._rightClickedDir = dir;
  }

  // no self drag
  legitDrag(dir: Directory) {
    if (this.dragAndDrop.component == UIComponent.DirView) {
      var selectedFiles = this.dirView.selectedFiles;
      if (this.isIncluded(dir, selectedFiles)) {
        return false;
      }
      if (!this.noParancy(dir, selectedFiles)) {
        return false;
      }
    } else if (this.dragAndDrop.component == UIComponent.NavigationTree) {
      if (this.getRef(dir).id == this.getRef(this.pressedDir).id) return false;
      else if (this.pressedDir.parent.id == dir.id) return false;
      else if (dir.parent && this.pressedDir.id == dir.parent.id) return false;
    }

    return true;
  }

  private notAChild(dir: Directory, files) {
    for (var i = 0; i < files.length; i++) {
      if (files[i].parent.id == dir.id) return false;
    }
    return true;
  }

  private noParancy(dir: Directory, files) {
    if (dir.type == FileType.Root) return this.notAChild(dir, files);
    for (var i = 0; i < files.length; i++) {
      if (dir.parent.id == files[i].id || files[i].parent.id == dir.id)
        return false;
    }
    return true;
  }

  private isIncluded(dir: Directory, files) {
    for (var i = 0; i < files.length; i++) {
      if (this.getRef(dir).id == this.getRef(files[i]).id) return true;
    }
    return false;
  }

  /*************
  /* Operations
  **************/
  // open directory by direct click and not by external notify
  openDir(dir: Directory, openByClick = true) {
    this.unselectPrevious.emit();
    if (dir.id != this.dirView.currentDir.id && openByClick)
      this.dirView.loadNewDir(dir);
  }
  ////////////

  private getRef(dir) {
    return dir.isShortcut ? dir.reference : dir;
  }
}
