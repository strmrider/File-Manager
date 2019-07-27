import { Injectable, EventEmitter } from "@angular/core";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { SystemService } from "../../system/system.service";
import { TasksService } from "../../tasks/tasks-service/tasks.service";
import { FileManagerService } from "../../file-manager/file-manager-service/file-manager.service";
import { DirViewService } from "../../file-manager/dir-view/dir-view-service/dir-view.service";
import { NavTreeService } from "../../file-manager/nav-tree/nav-tree.service";
import { UIComponent } from "src/app/shared/enums/UIComponent";
import { FileType } from "src/app/shared/enums/file-type";
import { Utilities } from "src/app/shared/utilities/utilities";
import { Comparisons } from "src/app/shared/utilities/copmarisons";

@Injectable({
  providedIn: "root"
})
export class MoveModalService {
  private _currentDir: Directory;
  private currentDirList: Directory[] = [];
  private _lastIndex = -1;
  private visibility = new EventEmitter();
  private clearMarks = new EventEmitter();
  public unselectRecent = new EventEmitter();
  public disable = new EventEmitter();
  public undisable = new EventEmitter();
  private updateSubscription;
  constructor(
    private system: SystemService,
    private tasks: TasksService,
    private fileManager: FileManagerService,
    private dirView: DirViewService,
    private navTree: NavTreeService
  ) {
    this.system.systemReadyEmitter.subscribe(
      () => (this._currentDir = this.dirView.currentDir)
    );
  }

  get title() {
    return "Move to";
  }
  get currentDir() {
    return this._currentDir;
  }

  get currentDirName() {
    if (this.currentDir) return this.currentDir.name;
    else return "";
  }

  get clearMarksEmitter() {
    return this.clearMarks;
  }

  get visibilityEmitter() {
    return this.visibility;
  }

  get dirList() {
    return this.currentDirList;
  }

  get lastIndex() {
    return this._lastIndex;
  }

  set lastIndex(index: number) {
    this._lastIndex = index;
  }

  display() {
    this.setCurrentDir();
    this.visibility.emit();
  }

  // is included in selected files
  isIncluded(index: number) {
    let files;
    if (this.fileManager.rightClickComponent == UIComponent.DirView)
      files = this.dirView.selectedFiles;
    else files = [this.navTree.rightClickedDir];

    for (let i = 0; i < files.length; i++) {
      if (this.dirList[index].id == files[i].id) return true;
      else if (
        files[i].parent.id == this.dirList[index].id ||
        this.dirList[index].parent.id == files[i]
      ) {
        return true;
      } else if (this.checkShortcut(this.dirList[index], files[i])) return true;
    }
    return false;
  }

  checkShortcut(dir: Directory, selectedFile) {
    if (selectedFile.isShortcut) {
      if (selectedFile.reference.id == dir.id) return true;
    }
    return false;
  }

  sameDir(index: number) {
    return this.dirList[index].id == this.currentDir.id;
  }

  reloadList() {
    this.loadList(this.currentDir);
  }

  loadList(dir: Directory) {
    this._currentDir = dir;
    this.lastIndex = -1;
    if (this.currentDir.subDirs.size > 0) {
      this.currentDirList = this.currentDir.subDirs.toArray();
      Utilities.sort.quickSort(this.currentDirList, Comparisons.nameCmp);
      this.disable.emit();
    } else this.currentDirList = [];

    this.setSubscription();
  }

  loadNewList(index: number) {
    this.loadList(this.currentDirList[index]);
  }

  goUp() {
    if (this.currentDir.type == FileType.Directory)
      this.loadList(this.currentDir.parent);
  }

  goToMain() {
    this.loadList(this.system.fileSystem.main);
  }

  newDir(name: string) {
    this.tasks.newDir(this.currentDir, name);
  }

  move() {
    let files;
    if (this.fileManager.rightClickComponent == UIComponent.DirView)
      files = this.dirView.selectedFiles;
    else files = [this.navTree.rightClickedDir];
    this.tasks.moveFiles(
      this.currentDirList[this._lastIndex],
      this.dirView.currentDir,
      files
    );
  }

  private setSubscription() {
    if (this.updateSubscription) this.updateSubscription.unsubscribe();
    this.updateSubscription = this.currentDir.generalUpdates.subscribe(() =>
      this.reloadList()
    );
  }

  private setCurrentDir() {
    if (this.fileManager.rightClickComponent == UIComponent.DirView) {
      if (this.dirView.currentDir.type == FileType.Starred)
        this.loadList(this.system.fileSystem.main);
      else this.loadList(this.dirView.currentDir);
    } else this.loadList(this.navTree.rightClickedDir.parent);
  }
}
