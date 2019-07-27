import { Injectable, EventEmitter } from "@angular/core";
import { DragAndDropIconService } from "../drag-and-drop-icon/drag-and-drop-icon.service";
import { DirViewService } from "../dir-view/dir-view-service/dir-view.service";
import { NavTreeService } from "../nav-tree/nav-tree.service";
import { SystemService } from "../../system/system.service";

@Injectable({
  providedIn: "root"
})
export class PathBarService {
  private _path = [];
  private dragLegit = new EventEmitter();
  constructor(
    private system: SystemService,
    private dragAndDrop: DragAndDropIconService,
    private dirView: DirViewService,
    private navTree: NavTreeService
  ) {
    this.path = this.system.fileSystem.main.path;
    this.dirView.setPathBarEmitter.subscribe(path => {
      this.path = path;
    });
  }

  get dragCheckEmitter() {
    return this.dragLegit;
  }
  get path() {
    return this._path;
  }

  set path(path) {
    this._path = path;
  }

  isDragOverLegit(index: number) {
    return this.navTree.legitDrag(this.path[index]);
  }

  openFolder(index: number) {
    let dir = this.path[index];
    if (dir.id != this.dirView.currentDir.id) {
      if (index < this.path.length) this.dirView.loadNewDir(this.path[index]);
    }
  }

  dropFiles(index: number) {
    let dir = this.path[index];
    if (this.dragAndDrop.isDragged && this.navTree.legitDrag(dir))
      this.navTree.dropFiles(dir);
  }
}
