import { Injectable, EventEmitter } from "@angular/core";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { FileItem } from "src/app/shared/models/file-system/file items/file-item";
import { ItemSelector } from "src/app/shared/models/item-selector";
import { Sort } from "src/app/shared/utilities/sort";
import { SystemService } from "../../../system/system.service";
import { TasksService } from "../../../tasks/tasks-service/tasks.service";
import { FileType } from "src/app/shared/enums/file-type";
import { Comparisons } from "src/app/shared/utilities/copmarisons";
import { File } from "src/app/shared/models/file-system/file items/file/file";
import { SortType } from "src/app/shared/enums/sort-type";
import { FilesIconSize } from "src/app/shared/enums/files-icons-size";
import { UIComponent } from "src/app/shared/enums/UIComponent";
import { DragAndDropIconService } from "../../drag-and-drop-icon/drag-and-drop-icon.service";
import { DirViewDisplayModeService } from "../dir-view-display-mode/dir-view-display-mode.service";
import { FileManagerService } from "../../file-manager-service/file-manager.service";
import { UploadManagerService } from "src/app/services/upload-manager/upload-manager.service";
import { UploadMethod } from "src/app/shared/enums/upload-method";

@Injectable({
  providedIn: "root"
})
export class DirViewService {
  public unselectCurrentNavTree = new EventEmitter();
  public selectAllEmitter = new EventEmitter();
  public setPathBarEmitter = new EventEmitter();
  public toolbarEmitter = new EventEmitter();

  private _currentDir: Directory;
  private dirFiles: FileItem[] = [];
  private searchFiles: FileItem[] = [];
  private _filesList: FileItem[] = [];
  private itemsSelector = new ItemSelector(0);
  private lastPressed = -1;
  private _totalSelectedSize: number = 0;
  private nonStarredItem = 0;
  private sortings = new Sort();
  private updateSubscription: any;

  constructor(
    private system: SystemService,
    private fileManager: FileManagerService,
    private tasks: TasksService,
    private dragAndDrop: DragAndDropIconService,
    private mode: DirViewDisplayModeService,
    private uploadManager: UploadManagerService
  ) {
    this.fileManager.readyToLoad.subscribe(() => {
      this.loadNewDir(this.system.fileSystem.main);
    });
  }

  get filesList() {
    return this._filesList;
  }

  get currentDir() {
    return this._currentDir;
  }

  get isCurrentTrash() {
    return this.currentDir.type == FileType.Trash;
  }

  get selectedIndices() {
    if (!this.itemsSelector) return [];
    return this.itemsSelector.getSelectedIndices();
  }

  get selectedFiles() {
    if (this.itemsSelector.isFullSelection) return this.filesList;
    else {
      var indices = this.selectedIndices;
      var files = [];
      for (var i = 0; i < indices.length; i++)
        files.push(this._filesList[indices[i]]);
      return files;
    }
  }

  get totalSelectedSize() {
    return this._totalSelectedSize;
  }

  get count() {
    return this.itemsSelector.count;
  }

  get fullSelection() {
    return this.itemsSelector.isFullSelection;
  }

  get lastSelectedIndex() {
    return this.itemsSelector.lastSelected;
  }
  get lastSelectedFile() {
    return this._filesList[this.lastSelectedIndex];
  }

  get lastPressedIndex() {
    return this.lastPressed;
  }

  get nonStarredItems() {
    if (this.nonStarredItem) return true;
    else return false;
  }

  /* Statusbar */
  get dirNumberOfItems() {
    if (this.currentDir) return this.currentDir.tree.numOfItems;
    else return 0;
  }

  // last pressed (mouse down or contextmenu) file index
  set lastPressedIndex(index: number) {
    this.lastPressed = index;
  }

  set increaseNonStarredItem(amount) {
    this.nonStarredItem += amount;
  }

  loadNewDir(dir: Directory) {
    if (this.updateSubscription) this.updateSubscription.unsubscribe();
    this._currentDir = dir;
    this.updateSubscription = this._currentDir.generalUpdates.subscribe(() => {
      this.reload();
    });
    let files = dir.tree.toArray();

    this.sortings.quickSort(files, Comparisons.nameCmp);
    this.dirFiles = files;
    this._filesList = files;
    this.initVars();
    this.notifyBindingComponents();

    if (
      (dir.isDirectory || dir.type == FileType.Root) &&
      this.system.isSystemReady
    )
      this.tasks.updateAccessDate(dir);
  }

  reload() {
    this.loadNewDir(this.currentDir);
  }

  search(keyword: string) {
    this.searchFiles = [];
    let len = keyword.length;
    let name: string = "";
    for (let i = 0; i < this.dirFiles.length; i++) {
      let file: FileItem = this.dirFiles[i];
      name = file.name.toLowerCase();
      if (name.substring(0, len) == keyword) this.searchFiles.push(file);
    }
    if (this.searchFiles.length > 0) {
      this.toolbarEmitter.emit("found");
      this._filesList = this.searchFiles;
    } else this.toolbarEmitter.emit("not_found");
  }

  exitSearchList() {
    this.searchFiles = [];
    this._filesList = this.dirFiles;
  }

  selectItem(index: number) {
    this.itemsSelector.select(index);
    this.setSelectionType(this._filesList[index]);
    this.updateTotalSize(this._filesList[index]);
  }

  unselectItem(index: number) {
    this.itemsSelector.unselect(index);
    this.setSelectionType(this._filesList[index], false);
    this.updateTotalSize(this._filesList[index], false);
  }

  unselectAllItems() {
    this.initVars();
    if (this.count) this.itemsSelector.clear();
  }

  isSelected(index: number) {
    return this.itemsSelector.isSelected(index);
  }

  clearAll() {
    this.itemsSelector.clear();
  }

  setSelectionType(file: FileItem, increase = true) {
    if (!file.status.isStar) {
      if (increase) this.nonStarredItem++;
      else this.nonStarredItem--;
    }
  }

  isDragOverLegit(dir: Directory) {
    if (this.dragAndDrop.component == UIComponent.NavigationTree) {
      // avoids same folder
      if (dir.id == this.fileManager.navTreeDraggedDir.id) return false;
      // dragged on parent
      else if (this.fileManager.navTreeDraggedDir.parent.id == dir.id)
        return false;
      // dragged on child
      else if (this.fileManager.navTreeDraggedDir.id == dir.parent.id)
        return false;
      else
        return this.isShortcutsDragLegit(dir, [
          this.fileManager.navTreeDraggedDir
        ]);
    } else {
      return this.isShortcutsDragLegit(dir, this.selectedFiles);
    }
  }

  isShortcutsDragLegit(dir, files) {
    for (let i = 0; i < files.length; i++) {
      if (files[i].isShortcut) {
        if (files[i].reference.id == dir.id) return false;
      }
      if (dir.isShortcut) {
        if (dir.reference.id == files[i].id) return false;
      }
    }
    return true;
  }

  changeFilesListOrder() {
    var split = this._currentDir.subDirs.size;
    var folders = this._filesList.splice(0, split).reverse();
    this._filesList = folders.concat(this._filesList.reverse());
  }

  selectAll() {
    if (this.filesList.length > 0) {
      this.selectAllEmitter.emit(true);
      this.itemsSelector.selectAll();
    }
  }

  sort(type: SortType) {
    switch (type) {
      case SortType.Name:
        this.sortings.quickSort(this._filesList, Comparisons.nameCmp);
        break;
      case SortType.CreationDate:
        this.sortings.quickSort(this._filesList, Comparisons.dateCmp);
        break;
      case SortType.Size:
        this.sortings.quickSort(this._filesList, Comparisons.sizeCmp);
        break;
    }
  }

  changeIconsSize(size: FilesIconSize) {
    this.mode.changeSize(size);
  }

  /*************
  /* Operations
  **************/
  dropFiles(targetDir: Directory) {
    if (this.dragAndDrop.component == UIComponent.NavigationTree) {
      let draggedDir = this.fileManager.navTreeDraggedDir;
      this.tasks.moveFiles(targetDir, draggedDir.parent, [draggedDir]);
    } else if (this.dragAndDrop.component == UIComponent.DirView) {
      this.tasks.moveFiles(targetDir, this.currentDir, this.selectedFiles);
    }
  }

  dropFromDesktop(files, index: number = -1) {
    let dir: any = this.currentDir;
    if (index >= 0) dir = this.filesList[index];
    this.uploadManager.setData(files, dir, UploadMethod.DragAndDrop);
    this.uploadManager.start();
  }

  openDir(index: number) {
    var dir: any = this._filesList[index];
    this.loadNewDir(dir);
  }

  openDirFromObject(dir: Directory) {
    this.loadNewDir(dir);
  }

  private initVars() {
    this.fileManager.currentViewedDir = this._currentDir;
    this.itemsSelector = new ItemSelector(this._filesList.length);

    this.lastPressed = -1;
    this.nonStarredItem = 0;
    this._totalSelectedSize = 0;
    this.searchFiles = [];
  }

  private notifyBindingComponents() {
    this.currentDir.notifyAsOpen.emit();
    this.toolbarEmitter.emit("clear");
    this.setPathBarEmitter.emit(this.currentDir.path);
  }

  private updateTotalSize(item: FileItem, add = true) {
    if (item.isFile) {
      let casting: any = item;
      let file: File = casting;
      if (add) this._totalSelectedSize += file.size.size;
      else if (this._totalSelectedSize > 0)
        this._totalSelectedSize -= file.size.size;
    }
  }
}
