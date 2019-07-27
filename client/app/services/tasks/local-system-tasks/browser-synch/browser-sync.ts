import { LocalSystemTasksService } from "../local-system-tasks.service";
import { BrowserSyncHandler } from "./browser-sync-handler";
import { FileItem } from "src/app/shared/models/file-system/file items/file-item";
import { Shortcut } from "src/app/shared/models/file-system/file items/shortcut";
import { File } from "src/app/shared/models/file-system/file items/file/file";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { FileDate } from "src/app/shared/models/file-system/file items/date/file-date";
import { FileSystemTasks } from "src/app/shared/enums/files-system-tasks";

export class BrowserSync {
  private messageHandler: BrowserSyncHandler;
  private bc = new BroadcastChannel("sync");

  constructor(tasks: LocalSystemTasksService) {
    this.messageHandler = new BrowserSyncHandler(tasks, this.bc);
  }

  addFile(parent: Directory, fileItem: FileItem) {
    this.bc.postMessage({
      task: FileSystemTasks.AddFile,
      parent: parent.id,
      fileItem: this.json(fileItem, true)
    });
  }

  rename(item: FileItem, newName: string, date: FileDate) {
    this.bc.postMessage({
      task: FileSystemTasks.Rename,
      item: item.id,
      name: newName,
      date: date
    });
  }

  note(item: FileItem, note: string, date: FileDate) {
    this.bc.postMessage({
      task: FileSystemTasks.UpdateNote,
      item: item.id,
      note: note,
      date: date
    });
  }

  moveFiles(
    target: Directory,
    source: Directory,
    items: FileItem[],
    date: FileDate
  ) {
    this.bc.postMessage({
      task: FileSystemTasks.Transfer,
      target: target.id,
      source: source.id,
      items: this.serializeItemsId(items),
      date: date
    });
  }

  removeFiles(items: FileItem[], date: FileDate) {
    this.bc.postMessage({
      task: FileSystemTasks.Remove,
      items: this.serializeItemsId(items),
      date: date
    });
  }

  removeFromTrash(items: FileItem[]) {
    this.bc.postMessage({
      task: FileSystemTasks.RemoveFromTrash,
      items: this.serializeItemsId(items)
    });
  }

  restore(items: FileItem[], date: FileDate) {
    this.bc.postMessage({
      task: FileSystemTasks.Restore,
      items: this.serializeItemsId(items),
      date: date
    });
  }

  cleanShortucts(items: Shortcut[]) {
    this.bc.postMessage({
      task: FileSystemTasks.CleanShortcuts,
      items: this.serializeItemsId(items)
    });
  }

  starStatus(items: FileItem[], status: boolean, date: FileDate) {
    this.bc.postMessage({
      task: FileSystemTasks.Star,
      items: this.serializeItemsId(items),
      status: status,
      date: date
    });
  }

  accessDate(dir: Directory, date: FileDate) {
    this.bc.postMessage({
      task: FileSystemTasks.AccessDate,
      items: this.serializeItemsId([dir]),
      date: date
    });
  }

  updateAuthKey(authKey: string) {
    this.bc.postMessage({
      task: FileSystemTasks.UpdateAuthKey,
      key: authKey
    });
  }

  private json(file: FileItem, dir) {
    var data = {
      name: file.name,
      id: file.id,
      type: file.type,
      parent: file.parent.id,
      status: file.status,
      dates: file.dates,
      note: file.note
    };

    if (file.isFile) {
      let cast: any = file;
      let regularFile: File = cast;
      data["extension"] = regularFile.extension;
      data["size"] = regularFile.size;
    } else if (file.isShortcut) {
      let cast: any = file;
      let shortut: Shortcut = cast;
      data["reference"] = shortut.reference.id;
    }

    return JSON.stringify(data);
  }

  private serializeItemsId(files: FileItem[]) {
    var paths = [];
    for (let i = 0; i < files.length; i++) {
      paths.push(files[i].id);
    }

    return paths;
  }
}
