import { StandardFileItem } from "../standard-file-item";
import { EventEmitter } from "@angular/core";
import { FileType } from "src/app/shared/enums/file-type";
import { FileItem } from "../file-item";
import { FileStatus } from "../file-status";
import { FileDatesList } from "../date/file-dates-list";
import { Shortcut } from "../shortcut";
import { FileTree } from "./file-tree";
import { Utilities } from "src/app/shared/utilities/utilities";

export class Directory extends StandardFileItem {
  private filesTree = new FileTree();
  private notifyOpen = new EventEmitter();
  private navTreeToggle = new EventEmitter();
  constructor(
    name: string,
    id: string,
    type: FileType,
    parent: Directory,
    status: FileStatus,
    dates: FileDatesList,
    note: string
  ) {
    super(id, name, type, parent, status, dates, note);
  }

  get notifyAsOpen() {
    return this.notifyOpen;
  }

  get toggleEmitter() {
    return this.navTreeToggle;
  }

  get subDirs() {
    return this.filesTree.directories;
  }

  get files() {
    return this.filesTree.files;
  }

  get tree() {
    return this.filesTree;
  }

  get numOfItems() {
    return this.filesTree.numOfItems;
  }

  get dirsUpdates() {
    return this.filesTree.dirsUpdates;
  }

  get generalUpdates() {
    return this.filesTree.generalUpdates;
  }

  get isEmpty() {
    return this.filesTree.numOfDir == 0 && this.filesTree.numOfFiles == 0;
  }

  removeFile(file: FileItem) {
    this.filesTree.remove(file);
  }

  costumRemoval(file: FileItem, cmpFunc: Function) {
    this.tree.costumRemoval(file, cmpFunc);
  }

  addFile(file: FileItem) {
    this.filesTree.add(file);
  }

  open() {
    this.notifyOpen.emit();
  }

  // overide
  copy() {
    return new Directory(
      "copy of " + this.name,
      Utilities.generateId(),
      this.type,
      this.parent,
      new FileStatus(),
      new FileDatesList(),
      ""
    );
  }

  //overide
  shortcut() {
    let name = "Shortcut of " + this.name;
    return new Shortcut(
      this,
      name,
      Utilities.generateId(),
      FileType.Shortcut,
      this.parent,
      new FileStatus(),
      new FileDatesList(),
      ""
    );
  }

  static newDir(parent: Directory, name: string) {
    return new Directory(
      name,
      Utilities.generateId(),
      FileType.Directory,
      parent,
      new FileStatus(),
      new FileDatesList(),
      ""
    );
  }
}
