import { BinaryTree } from "../../../data structures/binary tree/binary-tree";
import { EventEmitter } from "@angular/core";
import { Leaf } from "../../../data structures/binary tree/leaf";
import { Comparisons } from "src/app/shared/utilities/copmarisons";

export class FileTree {
  private _directories = new BinaryTree();
  private _files = new BinaryTree();

  private _dirsUpdates = new EventEmitter();
  private _generalUpdates = new EventEmitter();
  constructor() {}

  get directories() {
    return this._directories;
  }

  get files() {
    return this._files;
  }

  get numOfFiles() {
    return this._files.size;
  }

  get numOfDir() {
    return this._directories.size;
  }

  get numOfItems() {
    return this.numOfDir + this.numOfFiles;
  }

  get dirsUpdates() {
    return this._dirsUpdates;
  }

  get generalUpdates() {
    return this._generalUpdates;
  }

  // number of all sub folders and sub files
  private _deepContent(node = this._directories.root) {
    if (node == null) return 0;

    var totalSize = 0;
    if (node.elm.isDirectory) {
      totalSize += this._deepContent(node.elm.subDirs.root);
      totalSize += this._deepContent(node.elm.files.root);
    }

    totalSize += this._deepContent(node.left);
    totalSize += this._deepContent(node.right);

    return totalSize + 1;
  }

  public deepContent() {
    return this._deepContent() + this._files.size;
  }

  // counts total size of all files
  public totalFileSize(node: Leaf = this._files.root) {
    if (node == null) return 0;
    var totalSize = 0;
    totalSize += this.totalFileSize(node.elm.files.root);

    totalSize += this.totalFileSize(node.left);
    totalSize += this.totalFileSize(node.right);

    return totalSize + node.elm.size;
  }

  // deepSize- gets the size of all sub folders file
  private _deepSize(node = this._directories.root) {
    if (node == null) return 0;
    var totalSize = 0;
    if (node.elm.isDirectory) {
      totalSize += this.totalFileSize(node.elm.files.root);
      totalSize += this._deepSize(node.elm.subDirs.root);
    }

    totalSize += this._deepSize(node.left);
    totalSize += this._deepSize(node.right);

    return totalSize;
  }

  public deepSize() {
    return this.totalFileSize() + this._deepSize();
  }

  private isDirectory(file: any) {
    return file.isShortcut && file.reference
      ? file.reference.isDirectory
      : file.isDirectory;
  }

  remove(file: any) {
    if (this.isDirectory(file)) {
      this._directories.remove(file, Comparisons.objIdCmp);
      this.dirsUpdates.emit();
    } else this._files.remove(file, Comparisons.objIdCmp);

    this.generalUpdates.emit();
  }

  costumRemoval(file: any, cmpFunc: Function) {
    if (this.isDirectory(file)) {
      this._directories.remove(file, cmpFunc);
      this.dirsUpdates.emit();
    } else this._files.remove(file, cmpFunc);

    this.generalUpdates.emit();
  }

  add(file: any) {
    if (this.isDirectory(file)) {
      this._directories.add(file, Comparisons.objIdCmp);
      this.dirsUpdates.emit();
    } else this._files.add(file, Comparisons.objIdCmp);

    this.generalUpdates.emit();
  }

  search(id: string) {
    let res = this.directories.search(id, Comparisons.valueToObjCmp);
    if (!res) res = this.files.search(id, Comparisons.valueToObjCmp);

    return res.elm;
  }

  // search includes subtrees
  deepSearch(id: string) {
    let res = this.files.search(id, Comparisons.valueToObjCmp);
    if (!res)
      res = this._deepSearch(
        this.directories.root,
        id,
        Comparisons.valueToObjCmp
      );
    if (res) return res.elm;
    else return null;
  }

  _deepSearch(node: Leaf, value: any, cmpFunc: Function) {
    if (node == null) return;

    var cmpResult = cmpFunc(value, node.elm);
    var res;
    if (cmpResult == 0) {
      return node;
    } else if (node.elm.isDirectory && node.elm.numOfItems > 0) {
      res = node.elm.files.search(value, cmpFunc);
      if (!res)
        res = this._deepSearch(node.elm.tree.directories.root, value, cmpFunc);
      else {
        return res;
      }
    }

    if (!res) {
      res = this._deepSearch(node.right, value, cmpFunc);
      if (!res) res = this._deepSearch(node.left, value, cmpFunc);
    }

    return res;
  }

  toArray() {
    return this._directories.toArray().concat(this.files.toArray());
  }
}
