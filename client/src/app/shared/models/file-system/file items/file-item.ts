import { FileType } from "src/app/shared/enums/file-type";
import { Directory } from "./directory/directory";
import { FileStatus } from "./file-status";
import { FileDatesList } from "./date/file-dates-list";

export abstract class FileItem {
  constructor(
    private _id: string,
    private _name: string,
    private _type: FileType,
    private _parent: Directory,
    private _status: FileStatus,
    private _dates: FileDatesList,
    private _note: string
  ) {}

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get name() {
    return this._name;
  }

  get parent() {
    return this._parent;
  }

  get status() {
    return this._status;
  }

  get dates() {
    return this._dates;
  }

  get note() {
    return this._note;
  }

  get isSysFolder() {
    let sysDirs = [
      FileType.Root,
      FileType.Shared,
      FileType.Starred,
      FileType.Trash
    ];
    if (sysDirs.includes(this._type)) return true;
    else return false;
  }
  get isDirectory() {
    if (this._type == FileType.Directory) return true;
    else return false;
  }

  get isFile() {
    if (!this.isDirectory && !this.isShortcut && !this.isSysFolder) return true;
    else return false;
  }

  get isShortcut() {
    if (this._type == FileType.Shortcut) return true;
    else return false;
  }

  get path() {
    var path = [];
    if (this.isDirectory) {
      var parent = this._parent;

      while (parent) {
        path.push(parent);
        parent = parent.parent;
      }
      path.reverse();
    }
    path.push(this);
    return path;
  }

  set parent(newParent) {
    this._parent = newParent;
  }

  set note(newNote) {
    this._note = newNote;
  }

  set name(newName) {
    this._name = newName;
  }

  abstract copy(): any;
}
