import { FileItem } from "./file-item";
import { StandardFileItem } from "./standard-file-item";
import { FileType } from "src/app/shared/enums/file-type";
import { Directory } from "./directory/directory";
import { FileStatus } from "./file-status";
import { FileDatesList } from "./date/file-dates-list";

export class Shortcut extends FileItem {
  constructor(
    private _reference: StandardFileItem,
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

  get reference() {
    return this._reference;
  }

  set reference(reference: StandardFileItem) {
    this._reference = reference;
  }

  copy() {}

  // remove itself from reference's shortcuts list
  removeFromRef() {
    this._reference.removeShortcut(this.id);
  }

  addBackToRef() {
    this._reference.addShortcut(this);
  }
}
