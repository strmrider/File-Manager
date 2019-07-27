import { Directory } from "../file items/directory/directory";
import { FileType } from "src/app/shared/enums/file-type";
import { FileItem } from "../file items/file-item";
import { SystemDirs } from "./system-dirs";
import { Shortcut } from "../file items/shortcut";
import { File } from "../file items/file/file";

export class FileSystem {
  private sysDirs = new SystemDirs();
  private filesHash = new Object();
  private dirs: Object;
  private _storageSize = 0;
  constructor() {}

  getMain() {
    return this.sysDirs.root;
  }

  get main() {
    return this.sysDirs.root;
  }

  get trash() {
    return this.sysDirs.trash;
  }

  get shared() {
    return this.sysDirs.shared;
  }

  get starred() {
    return this.sysDirs.starred;
  }

  get storageSize() {
    return this._storageSize;
  }

  reduceStorageSize(size: number) {
    this._storageSize -= size;
  }

  increaseStorageSize(size: number) {
    this._storageSize += size;
  }

  /***********************************
   * Set file system from server data
   ***********************************/
  setSystem(dirs: Object, files: Object) {
    this.dirs = dirs;
    this.filesHash = files;
    this.attachFilesToFolders();
    this.coalesceDirs(Object.keys(dirs));
    this.sysDirs.root = this.dirs[this.sysDirs.root.id];
    // free objects
    this.dirs = null;
    this.filesHash = null;
  }

  coalesceDirs(dirsList) {
    var dir: Directory;
    var parentId: any;
    for (var i = 0; i < dirsList.length; i++) {
      dir = this.dirs[dirsList[i]];
      if (dir.type != FileType.Root) {
        parentId = dir.parent;
        dir.parent = this.dirs[parentId];
        this.setInSystemDirs(dir);
        if (!dir.status.deleted && !dir.isSysFolder) {
          this.dirs[parentId].addFile(dir);
        }
      }
    }
  }

  attachFilesToFolders() {
    var file: FileItem;
    var id: any;
    var filesList = Object.keys(this.filesHash);
    for (var i = 0; i < filesList.length; i++) {
      file = this.filesHash[filesList[i]];
      id = file.parent;
      file.parent = this.dirs[id];
      this.setInSystemDirs(file);

      if (file.isShortcut) this.handleShortcut(file);
      else {
        let cast: any = file;
        this._storageSize += cast.size.size;
      }
      if (this.isLegitForAddingToDir(file)) {
        this.dirs[id].addFile(file);
      }
    }
  }

  private isLegitForAddingToDir(file) {
    if (file.isShortcut && !file.status.deleted) {
      let shortcut: Shortcut = file;
      if (shortcut.reference && !shortcut.reference.status.deleted) return true;
    } else if (!file.status.deleted && !file.isSysFolder) return true;

    return false;
  }

  // sets file object as shortcut's reference
  private handleShortcut(file) {
    let shortcut: Shortcut = file;
    let ref = this.getFileItemFromHash(shortcut.reference);
    // sets the object instead of the id as string
    shortcut.reference = ref;
    if (ref) ref.addShortcut(shortcut);
  }

  setInSystemDirs(file: FileItem) {
    if (file.status.deleted) {
      this.sysDirs.trash.addFile(file);
    } else if (file.status.isStar) this.sysDirs.starred.addFile(file);
  }

  getFileByPath(path: string[]) {
    var res = this.main;
    for (var i = 0; i < path.length; i++) {
      res = res.tree.search(path[i]);
      if (!res) return null;
    }

    return res;
  }

  getFile(id: string) {
    let file;
    if (id == "0") return this.main;
    if ((file = this.main.tree.deepSearch(id))) {
      return file;
    } else {
      return this.trash.tree.deepSearch(id);
    }
  }

  private getFileItemFromHash(id: any) {
    if (this.dirs && this.filesHash) {
      let file = this.dirs[id];
      if (!file) {
        file = this.filesHash[id];
      }
      return file;
    }
  }
}
