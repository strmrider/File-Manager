import { FileItem } from "./file-item";
import { FileType } from "src/app/shared/enums/file-type";
import { FileDatesList } from "./date/file-dates-list";
import { FileStatus } from "./file-status";
import { Directory } from "./directory/directory";
import { Shortcut } from "./shortcut";

// Standard file items are files and directories only (exclude shortcuts)
export abstract class StandardFileItem extends FileItem {
  private _shortcuts: Shortcut[];
  constructor(
    id: string,
    name: string,
    type: FileType,
    parent: Directory,
    status: FileStatus,
    dates: FileDatesList,
    note: string
  ) {
    super(id, name, type, parent, status, dates, note);
    this._shortcuts = [];
  }

  get shortcuts() {
    return this._shortcuts;
  }

  addShortcut(shortcut: Shortcut) {
    this.shortcuts.push(shortcut);
  }

  removeShortcut(id: string) {
    for (var i = 0; i < this.shortcuts.length; i++)
      if (this.shortcuts[i].id == id) this.shortcuts.splice(i, 1);
  }

  removeAllShortcuts() {
    for (var i = 0; i < this.shortcuts.length; i++) {
      this.shortcuts[i].parent.removeFile(this.shortcuts[i]);
    }
  }

  get shortcutCount() {
    return this.shortcuts.length;
  }

  abstract shortcut(): Shortcut;
}
