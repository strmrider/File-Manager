import { Injectable } from "@angular/core";
import { SystemService } from "../../system/system.service";
import { FileItem } from "src/app/shared/models/file-system/file items/file-item";
import { FileDate } from "src/app/shared/models/file-system/file items/date/file-date";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { Shortcut } from "src/app/shared/models/file-system/file items/shortcut";
import { File } from "src/app/shared/models/file-system/file items/file/file";
import { FileStatus } from "src/app/shared/models/file-system/file items/file-status";
import { FileDatesList } from "src/app/shared/models/file-system/file items/date/file-dates-list";
import { Utilities } from "src/app/shared/utilities/utilities";
import { FileTypeConverter } from "src/app/shared/models/file-system/file items/file/file-types-handler";
import { BrowserSync } from "./browser-synch/browser-sync";

@Injectable({
  providedIn: "root"
})
export class LocalSystemTasksService {
  private sync: BrowserSync;
  constructor(private system: SystemService) {
    this.sync = new BrowserSync(this);
  }

  get fileSystem() {
    return this.system.fileSystem;
  }

  public updateDate(file: FileItem, date: FileDate) {
    if (!file.isSysFolder) file.dates.modified.update(date, true);
  }

  public moveFiles(
    target: Directory,
    source: Directory,
    files: FileItem[],
    date: FileDate,
    sync = false
  ) {
    for (var i = 0; i < files.length; i++) {
      source.removeFile(files[i]);
      target.addFile(files[i]);
      files[i].parent = target;
    }
    this.updateDate(target, date);
    this.updateDate(source, date);
    if (sync) this.sync.moveFiles(target, source, files, date);
  }

  // removes to trash
  public removeFiles(files: FileItem[], date: FileDate, sync: boolean) {
    for (let i = 0; i < files.length; i++) {
      files[i].parent.removeFile(files[i]);
      files[i].status.deleted = true;
      this.system.fileSystem.trash.addFile(files[i]);

      if (files[i].status.isStar)
        this.starStatus(false, [files[i]], date, false);
      this.handleShortcutsRemoval(files[i]);
    }
    this.updateDate(files[0], date);
    if (sync) this.sync.removeFiles(files, date);
  }

  public removeFromTrash(files: FileItem[], sync: boolean) {
    var trash = this.system.fileSystem.trash;
    var castedFile: any;
    for (let i = 0; i < files.length; i++) {
      castedFile = files[i];
      trash.removeFile(files[i]);

      if (files[i].isFile)
        this.system.fileSystem.reduceStorageSize(castedFile.size.size);
      if (files[i].isShortcut) {
        castedFile = files[i];
        let shortcut: Shortcut = castedFile;
        shortcut.removeFromRef();
      } else if (!files[i].isShortcut && castedFile.shortcutCount > 0) {
        this.cleanShortcuts(castedFile.shortcuts, true);
      }

      if (files[i].isDirectory) {
        let cast: any = files[i];
        this.cleanOrphanFilesFromTrash(cast);
      }
    }
    if (sync) this.sync.removeFromTrash(files);
  }

  public restore(files: FileItem[], date: FileDate, sync: boolean) {
    var trash = this.system.fileSystem.trash;
    for (let i = 0; i < files.length; i++) {
      files[i].parent.addFile(files[i]);
      this.updateDate(files[i].parent, date);
      files[i].status.deleted = false;
      trash.removeFile(files[i]);
      this.handleShortcutsRestoration(files[i]);
    }
    if (sync) this.sync.restore(files, date);
  }

  public copyFiles(parent: Directory, files: FileItem[], sync: boolean) {
    for (var i = 0; i < files.length; i++) {
      let copy = files[i].copy();
      parent.addFile(copy);
      if (sync) this.sync.addFile(parent, copy);
    }
    this.updateDate(parent, files[0].dates.modified);
  }

  public starStatus(
    status: boolean,
    files: FileItem[],
    date: FileDate,
    sync: boolean
  ) {
    for (var i = 0; i < files.length; i++) {
      files[i].status.star = status;
      if (status) {
        this.system.fileSystem.starred.addFile(files[i]);
      } else {
        this.system.fileSystem.starred.removeFile(files[i]);
      }
      this.updateDate(files[i], date);
    }
    if (sync) this.sync.starStatus(files, status, date);
  }

  public rename(
    file: FileItem,
    newName: string,
    date: FileDate,
    sync: boolean
  ) {
    file.name = newName;
    this.updateDate(file, date);
    if (sync) this.sync.rename(file, newName, date);
  }

  public updateNote(
    file: FileItem,
    note: string,
    date: FileDate,
    sync: boolean
  ) {
    file.note = note;
    this.updateDate(file, date);
    if (sync) this.sync.note(file, note, date);
  }

  public updateAccessDate(dir: Directory, date: FileDate, sync: boolean) {
    dir.dates.access.update(date, true);
    if (sync) this.sync.accessDate(dir, date);
  }

  public addFile(
    parent: Directory,
    fileItem: FileItem,
    updateFromAddedFile: boolean,
    sync: boolean
  ) {
    var castedFile: any = fileItem;
    if (fileItem.isFile)
      this.system.fileSystem.increaseStorageSize(castedFile.size.size);
    if (fileItem.isShortcut) {
      castedFile.reference.addShortcut(fileItem);
    }
    parent.addFile(fileItem);
    if (updateFromAddedFile) this.updateDate(parent, fileItem.dates.modified);
    if (sync) this.sync.addFile(parent, fileItem);
  }

  public cleanShortcuts(shortcuts: Shortcut[], sync: boolean) {
    for (var i = 0; i < shortcuts.length; i++) {
      if (shortcuts[i].status.deleted)
        this.system.fileSystem.trash.removeFile(shortcuts[i]);
      else shortcuts[i].parent.removeFile(shortcuts[i]);
    }
    if (sync) this.sync.cleanShortucts(shortcuts);
  }

  public updateAuthKey(authKey: string, sync: boolean) {
    this.system.updateAuthKey(authKey);
    if (sync) this.sync.updateAuthKey(authKey);
  }

  public notifyNewAuthKey(authKey: string) {
    this.sync.updateAuthKey(authKey);
  }

  /* Uploads */

  public uploadFiles(filesList: any[], parent: Directory) {
    var file: File;
    for (var i = 0; i < filesList.length; i++) {
      file = this.setNewFile(filesList[i], parent);
      this.addFile(parent, file, false, false);
    }
  }

  public setNewFile(file, parent): File {
    var type = file.type.split("/")[0];
    type = FileTypeConverter.convert(type);
    var newFile = new File(
      Utilities.generateId(),
      file.name,
      file.name.split(".")[1],
      file.size,
      type,
      parent,
      new FileStatus(),
      new FileDatesList(),
      ""
    );
    return newFile;
  }

  /*********************
   * Shortcuts handling
   *********************/
  private handleShortcutsRemoval(file: any) {
    if (!file.isShortcut && file.shortcutCount > 0) {
      this.cleanShortcuts(file.shortcuts, false);
    }
  }

  private handleShortcutsRestoration(file: any) {
    if (!file.isShortcut && file.shortcutCount > 0) {
      this.restoreShortcuts(file.shortcuts);
    }
  }

  private cleanOrphanFilesFromTrash(parent: Directory) {
    var arr = this.fileSystem.trash.tree.toArray();
    for (let i = 0; i < arr.length; i++) {
      let file: FileItem = arr[i];
      if (file.parent.id == parent.id) this.fileSystem.trash.removeFile(file);
    }
  }

  private restoreShortcuts(shortcuts: Shortcut[]) {
    for (var i = 0; i < shortcuts.length; i++) {
      if (shortcuts[i].parent && !shortcuts[i].parent.status.deleted) {
        // restore shortcut if it hasn't been removed
        if (!shortcuts[i].status.deleted) {
          this.system.fileSystem.trash.removeFile(shortcuts[i]);
          shortcuts[i].parent.addFile(shortcuts[i]);
        } // if shortcut is removed, readd to trash and don't restore
        else this.system.fileSystem.trash.addFile(shortcuts[i]);
      }
    }
  }
}
