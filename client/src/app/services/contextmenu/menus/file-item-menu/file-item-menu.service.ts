import { Injectable } from "@angular/core";
import { ContextMenuDataDefiner } from "../../shared/contextmenu-items-definer";
import { DirViewService } from "src/app/services/file-manager/dir-view/dir-view-service/dir-view.service";
import { FileManagerService } from "src/app/services/file-manager/file-manager-service/file-manager.service";
import { TasksService } from "src/app/services/tasks/tasks-service/tasks.service";
import { UIComponent } from "src/app/shared/enums/UIComponent";
import { NavTreeService } from "src/app/services/file-manager/nav-tree/nav-tree.service";
import { NameModalService } from "src/app/services/modals/name-modal/name-modal.service";
import { MoveModalService } from "src/app/services/modals/move-modal/move-modal.service";
import { FilePreviewService } from "src/app/services/file-preview/file-preview.service";

@Injectable({
  providedIn: "root"
})
export class FileItemMenuService extends ContextMenuDataDefiner {
  private navTree: boolean = false;
  constructor(
    private dirView: DirViewService,
    private NavTree: NavTreeService,
    private fileManager: FileManagerService,
    private tasks: TasksService,
    private filePreview: FilePreviewService,
    private renameModal: NameModalService,
    private moveModal: MoveModalService
  ) {
    super();
  }

  setItems() {
    this._items = [
      this.setItem(
        "Open folder",
        "fas fa-folder-open",
        this.openDir.bind(this)
      ),
      this.setItem("Preview", "fas fa-eye", this.preview.bind(this)),
      this.setItem("hr/"),
      this.setItem("Move to", "fas fa-exchange-alt", this.move.bind(this)),
      this.setItem("Rename", "fas fa-pen", this.rename.bind(this)),
      this.setItem("Remove", "fas fa-trash-alt", this.remove.bind(this)),
      this.setItem("hr/"),
      this.setItem("Copy", "fas fa-copy", this.copy.bind(this)),
      this.setItem("Shortcut", "fas fa-share", this.shortcut.bind(this)),
      this.setItem("Download", "fas fa-download", this.download.bind(this)),
      this.setItem("hr/"),
      this.setItem("Share", "fas fa-users"),
      this.setItem("Star", "fas fa-star", this.star.bind(this)),
      this.setItem("unStar", "far fa-star", this.unstar.bind(this)),
      this.setItem("hr/"),
      this.setItem("Details", "fas fa-info-circle", this.openDetails.bind(this))
    ];
  }

  display(dir = false, unstarred = false, navTree = false) {
    this.navTree = navTree;
    if (navTree) this.navTreeMenu();
    else {
      if (dir) this.folderMenu();
      else this.fileMenu();
    }
    this.setStarItem(unstarred);
    this.status = true;
  }

  private navTreeMenu() {
    this.navTree = true;
    this.folderMenu();
    this._items[8].visibility = false; // shortcut
    this._items[6].visibility = false;
  }

  private folderMenu() {
    this._items[0].visibility = true;
    this._items[1].visibility = false;
    this._items[2].visibility = true;
    this._items[6].visibility = true;
    this._items[7].visibility = false;
    this._items[8].visibility = true;
  }

  private fileMenu() {
    this._items[0].visibility = false;
    this._items[1].visibility = true;
    this._items[2].visibility = true;
    this._items[6].visibility = true;
    this._items[7].visibility = true;
    this._items[8].visibility = true;
  }

  filePreviewMenu(unstarred = false) {
    this._items[0].visibility = false;
    this._items[1].visibility = false;
    this._items[2].visibility = false;
    this._items[6].visibility = true;
    this._items[8].visibility = true;

    this.setStarItem(unstarred);
    this.status = true;
  }

  private setStarItem(unstarred: boolean) {
    if (unstarred) {
      this._items[12].visibility = true;
      this._items[13].visibility = false;
    } else {
      this._items[12].visibility = false;
      this._items[13].visibility = true;
    }
  }

  /*************
  /* Operations
  **************/

  private getSelectedFiles() {
    if (this.navTree) return [this.NavTree.rightClickedDir];
    else return this.dirView.selectedFiles;
  }

  private ifShortcut(item: any) {
    return item.isShortcut ? item.reference : item;
  }

  private openDir() {
    if (this.fileManager.rightClickComponent == UIComponent.DirView) {
      this.dirView.openDirFromObject(
        this.ifShortcut(this.dirView.lastSelectedFile)
      );
    } else if (
      this.fileManager.rightClickComponent == UIComponent.NavigationTree
    ) {
      this.NavTree.openDir(this.ifShortcut(this.NavTree.rightClickedDir));
    }
  }

  private preview() {
    this.filePreview.display(this.dirView.lastSelectedFile);
  }

  private remove() {
    this.tasks.removeFiles(this.getSelectedFiles());
  }

  private copy() {
    this.tasks.copyFiles(this.dirView.currentDir, this.dirView.selectedFiles);
  }

  private shortcut() {
    this.tasks.createShortcuts(
      this.dirView.currentDir,
      this.dirView.selectedFiles
    );
  }

  private star() {
    this.starStatus(true);
  }

  private unstar() {
    this.starStatus(false);
  }

  private starStatus(status: boolean) {
    this.tasks.setStarStatus(this.getSelectedFiles(), status, true);
  }

  private rename() {
    var file;
    if (this.fileManager.rightClickComponent == UIComponent.DirView)
      file = this.dirView.lastSelectedFile;
    else if (
      this.fileManager.rightClickComponent == UIComponent.NavigationTree
    ) {
      file = this.NavTree.rightClickedDir;
    }
    this.renameModal.display(0, file);
  }

  private move() {
    this.moveModal.display();
  }

  private openDetails() {
    this.fileManager.displayFilesDetails();
  }

  private download() {
    let files = this.getSelectedFiles();
    if (files.length == 1 && files[0].isFile)
      this.tasks.downloadSingleFile(files[0]);
    else this.tasks.downloadFiles(files);
  }
}
