import { LocalSystemTasksService } from "../local-system-tasks.service";
import { FileSystemTasks } from "src/app/shared/enums/files-system-tasks";
import { FileDate } from "src/app/shared/models/file-system/file items/date/file-date";
import { File } from "src/app/shared/models/file-system/file items/file/file";
import { Shortcut } from "src/app/shared/models/file-system/file items/shortcut";
import { FileType } from "src/app/shared/enums/file-type";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { FileDatesList } from "src/app/shared/models/file-system/file items/date/file-dates-list";

export class BrowserSyncHandler {
  constructor(
    private tasks: LocalSystemTasksService,
    private bc: BroadcastChannel
  ) {
    var _this = this;
    this.bc.onmessage = function(event) {
      _this.handleTasks(event.data.task, event.data);
    };
  }

  private regenerateFileItem(data) {
    var item;
    data = JSON.parse(data);
    var parent = this.tasks.fileSystem.getFile(data.parent);
    var dates = new FileDatesList();
    dates.setByJSONparsedObject(data.dates);
    if (data.type == 1) {
      item = new Directory(
        data.name,
        data.id,
        data.type,
        parent,
        data.status,
        dates,
        data.note
      );
    } else if (data.type == FileType.Shortcut) {
      let reference = this.tasks.fileSystem.getFile(data.reference);
      item = new Shortcut(
        reference,
        data.name,
        data.id,
        data.type,
        parent,
        data.status,
        dates,
        data.note
      );
    } else {
      item = new File(
        data.id,
        data.name,
        data.extension,
        data.size,
        data.type,
        parent,
        data.status,
        dates,
        data.note
      );
    }

    return item;
  }

  private deserializeItemsId(ids: []) {
    var files = [];
    for (let i = 0; i < ids.length; i++) {
      files.push(this.tasks.fileSystem.getFile(ids[i]));
    }

    return files;
  }

  private getDate(obj) {
    let date = new FileDate();
    date.setByJSONparsedObject(obj);
    return date;
  }

  private handleTasks(task: FileSystemTasks, data) {
    switch (task) {
      case FileSystemTasks.AddFile:
        this.addFile(data);
        break;
      case FileSystemTasks.Rename:
        this.rename(data);
        break;
      case FileSystemTasks.UpdateNote:
        this.noteUpdate(data);
        break;
      case FileSystemTasks.Transfer:
        this.fileTrasnfer(data);
        break;
      case FileSystemTasks.Remove:
        this.fileRemoval(data);
        break;
      case FileSystemTasks.RemoveFromTrash:
        this.removalFromTrash(data);
        break;
      case FileSystemTasks.Restore:
        this.removalFilesRestore(data);
        break;
      case FileSystemTasks.Star:
        this.starStatus(data);
        break;
      case FileSystemTasks.AccessDate:
        this.accessDate(data);
        break;
      case FileSystemTasks.UpdateAuthKey:
        this.authKeyUpdate(data);
        break;
    }
  }

  private addFile(data) {
    let item = this.regenerateFileItem(data.fileItem);
    let parent = this.tasks.fileSystem.getFile(data.parent);
    this.tasks.addFile(parent, item, false, false);
  }

  private rename(data) {
    let item = this.tasks.fileSystem.getFile(data.item);
    if (item) {
      this.tasks.rename(item, data.name, this.getDate(data.date), false);
    }
  }

  private noteUpdate(data) {
    let item = this.tasks.fileSystem.getFile(data.item);
    if (item)
      this.tasks.updateNote(item, data.note, this.getDate(data.date), false);
  }

  private fileTrasnfer(data) {
    let source = this.tasks.fileSystem.getFile(data.source);
    let target = this.tasks.fileSystem.getFile(data.target);
    let items = this.deserializeItemsId(data.items);
    this.tasks.moveFiles(target, source, items, this.getDate(data.date));
  }

  private fileRemoval(data) {
    let items = this.deserializeItemsId(data.items);
    this.tasks.removeFiles(items, this.getDate(data.date), false);
  }

  private removalFromTrash(data) {
    let items = this.deserializeItemsId(data.items);
    this.tasks.removeFromTrash(items, false);
  }

  private removalFilesRestore(data) {
    let items = this.deserializeItemsId(data.items);
    this.tasks.restore(items, data.date, false);
  }

  private starStatus(data) {
    let items = this.deserializeItemsId(data.items);
    this.tasks.starStatus(data.status, items, data.date, false);
  }

  private accessDate(data) {
    let items = this.deserializeItemsId(data.items);
    this.tasks.updateAccessDate(items[0], data.date, false);
  }

  private authKeyUpdate(data) {
    this.tasks.updateAuthKey(data.key, false);
  }
}
