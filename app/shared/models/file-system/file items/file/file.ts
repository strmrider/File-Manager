import { StandardFileItem } from "../standard-file-item";
import { FileSize } from "./file-size";
import { FileType } from "src/app/shared/enums/file-type";
import { Directory } from "../directory/directory";
import { FileStatus } from "../file-status";
import { FileDatesList } from "../date/file-dates-list";

import { Shortcut } from "../shortcut";
import { Utilities } from "src/app/shared/utilities/utilities";

export class File extends StandardFileItem {
  private _size: FileSize;
  private _extenstion: string;
  constructor(
    id: string,
    name: string,
    extension: string,
    size: number,
    type: FileType,
    parent: Directory,
    status: FileStatus,
    dates: FileDatesList,
    note: string
  ) {
    super(id, name, type, parent, status, dates, note);
    this._size = new FileSize(size);
    this._extenstion = extension;
  }

  get size() {
    return this._size;
  }

  get extension() {
    return this._extenstion;
  }

  get filename() {
    return this.id + "." + this.extension;
  }

  get isMedia() {
    return (
      this.type == FileType.Image ||
      this.type == FileType.Video ||
      this.type == FileType.Audio
    );
  }

  copy() {
    return new File(
      Utilities.generateId(),
      "copy of " + this.name,
      this._extenstion,
      this._size.size,
      this.type,
      this.parent,
      new FileStatus(),
      new FileDatesList(),
      ""
    );
  }

  //overide
  shortcut() {
    return new Shortcut(
      this,
      "Shortcut of " + this.name,
      Utilities.generateId(),
      FileType.Shortcut,
      this.parent,
      new FileStatus(),
      new FileDatesList(),
      ""
    );
  }
}
