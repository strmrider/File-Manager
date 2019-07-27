import { Injectable, EventEmitter } from "@angular/core";
import { SystemService } from "../../system/system.service";
import { LocalSystemTasksService } from "../local-system-tasks/local-system-tasks.service";
import { HttpClient } from "@angular/common/http";
import { RequestsBuilder } from "./request-builder";
import { TaskNotificationCreator } from "../shared/task-notification-creator";
import { File } from "src/app/shared/models/file-system/file items/file/file";
import { FileTypeConverter } from "src/app/shared/models/file-system/file items/file/file-types-handler";
import { Utilities } from "src/app/shared/utilities/utilities";
import { FileStatus } from "src/app/shared/models/file-system/file items/file-status";
import { FileDatesList } from "src/app/shared/models/file-system/file items/date/file-dates-list";
import { FileItem } from "src/app/shared/models/file-system/file items/file-item";
import { FileDate } from "src/app/shared/models/file-system/file items/date/file-date";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { Shortcut } from "src/app/shared/models/file-system/file items/shortcut";
import { RequestType } from "src/app/shared/enums/request-type";

@Injectable({
  providedIn: "root"
})
export class TasksService {
  private offline: boolean;
  private browserSync: boolean;
  private responsType: object = { responseType: "text" };
  private requestBuilder: RequestsBuilder;
  private noteCreator = new TaskNotificationCreator();

  private notifyStart = new EventEmitter();
  private notifyEnd = new EventEmitter();
  private uploadeDone = new EventEmitter();
  private invokeDownload = new EventEmitter();

  constructor(
    private system: SystemService,
    private localTasks: LocalSystemTasksService,
    private http: HttpClient
  ) {
    this.system.updateProfile.subscribe(() => this.updateRequestData());
    this.system.loggedInEmitter.subscribe(() => {
      this.updateRequestData();
      this.offline = this.system.config.offline;
      this.browserSync = this.system.config.browserSynch;
    });
    this.requestBuilder = new RequestsBuilder(this.system.username, null);
  }

  updateRequestData() {
    this.requestBuilder.updateBasicData(
      this.system.profile.username,
      this.system.profile.authKey
    );
  }
  get notifyStartEmitter() {
    return this.notifyStart;
  }

  get notifyEndEmitter() {
    return this.notifyEnd;
  }

  get uploadDoneEmitter() {
    return this.uploadeDone;
  }

  get invokeDowbloadEmitter() {
    return this.invokeDownload;
  }

  private printFormData(formData: FormData) {
    formData.forEach((value, key) => {
      console.log(key + " " + value);
    });
  }

  private setNewFile(file, parent): File {
    var type = file.type.split("/")[0];
    type = FileTypeConverter.convert(type);
    var newFile = new File(
      Utilities.generateId(),
      file.name,
      Utilities.getExtension(file.name),
      file.size,
      type,
      parent,
      new FileStatus(),
      new FileDatesList(),
      ""
    );
    return newFile;
  }

  deleteFromTrash(files: FileItem[], notify: boolean) {
    if (notify) this.notifyStart.emit(this.noteCreator.removeFromTrash(files));
    if (this.offline) this.localTasks.removeFromTrash(files, this.browserSync);
    else {
      var request = this.requestBuilder.remove(files);
      this.http
        .post(this.system.config.tasksAdress, request, this.responsType)
        .subscribe(res => {
          if (res != RequestType.RequestFailed)
            this.localTasks.removeFromTrash(files, this.browserSync);
          if (notify) this.notifyEnd.emit(res);
        });
    }
  }

  removeFiles(files: FileItem[], notify: boolean = true) {
    if (notify)
      this.notifyStart.emit(
        this.noteCreator.fileRemoval(files, files[0].parent)
      );
    var date = new FileDate();
    if (this.offline)
      this.localTasks.removeFiles(files, date, this.browserSync);
    else {
      var request = this.requestBuilder.moveToTrash(files, date);
      this.http
        .post(this.system.config.tasksAdress, request, this.responsType)
        .subscribe(res => {
          if (res != RequestType.RequestFailed)
            this.localTasks.removeFiles(files, date, this.browserSync);
          if (notify) this.notifyEnd.emit(res);
        });
    }
  }

  restore(files: FileItem[], notify: boolean) {
    if (notify) this.notifyStart.emit(this.noteCreator.fileRestore(files));
    var date = new FileDate();
    if (this.offline) this.localTasks.restore(files, date, this.browserSync);
    else {
      var request = this.requestBuilder.restore(files, date);
      this.http
        .post(this.system.config.tasksAdress, request, this.responsType)
        .subscribe(res => {
          if (res != RequestType.RequestFailed)
            this.localTasks.restore(files, date, true);
          if (notify) this.notifyEnd.emit(res);
        });
    }
  }

  public moveFiles(
    target: Directory,
    source: Directory,
    files: FileItem[],
    notify = true
  ) {
    if (notify)
      this.notifyStart.emit(
        this.noteCreator.fileTransfer(files, source, target)
      );
    var date = new FileDate();
    if (this.offline)
      this.localTasks.moveFiles(target, source, files, date, this.browserSync);
    else {
      var request = this.requestBuilder.moveFiles(files, source, target, date);
      this.http
        .post(this.system.config.tasksAdress, request, this.responsType)
        .subscribe(res => {
          if (res != RequestType.RequestFailed)
            this.localTasks.moveFiles(
              target,
              source,
              files,
              date,
              this.browserSync
            );
          if (notify) this.notifyEnd.emit(res);
        });
    }
  }

  rename(file: FileItem, name: string, notify: boolean) {
    if (notify)
      this.notifyStart.emit(this.noteCreator.fileRename(file, file.name));
    var date = new FileDate();
    if (this.offline)
      this.localTasks.rename(file, name, date, this.browserSync);
    else {
      var request = this.requestBuilder.rename(file, name, date);
      this.http
        .post(this.system.config.tasksAdress, request, this.responsType)
        .subscribe(res => {
          if (res != RequestType.RequestFailed)
            this.localTasks.rename(file, name, date, this.browserSync);
          if (notify) this.notifyEnd.emit(res);
        });
    }
  }

  updateNote(file: FileItem, note: string, notify: boolean) {
    var date = new FileDate();
    if (this.offline)
      this.localTasks.updateNote(file, note, date, this.browserSync);
    var request = this.requestBuilder.note(file, note, date);
    this.http
      .post(this.system.config.tasksAdress, request, this.responsType)
      .subscribe(res => {
        if (res != RequestType.RequestFailed)
          this.localTasks.updateNote(file, note, date, this.browserSync);
      });
  }

  newDir(parent: Directory, name: string) {
    var dir = Directory.newDir(parent, name);
    this._newDir(dir);
    return dir;
  }

  private _newDir(dir: Directory) {
    if (this.offline)
      this.localTasks.addFile(dir.parent, dir, true, this.browserSync);
    var request = this.requestBuilder.newDir(dir);
    this.http
      .post(this.system.config.tasksAdress, request, this.responsType)
      .subscribe(res => {
        if (res != RequestType.RequestFailed)
          this.localTasks.addFile(dir.parent, dir, true, this.browserSync);
      });
  }

  createShortcuts(parent: Directory, files: any[]) {
    var file: any;
    for (var i = 0; i < files.length; i++) {
      if (!files[i].isShortcut) {
        file = files[i].shortcut();
      } else file = files[i].copy();
      this.shortcut(parent, file);
    }
  }

  private shortcut(parent: Directory, shortcut: Shortcut) {
    if (this.offline)
      this.localTasks.addFile(parent, shortcut, true, this.browserSync);
    else {
      var request = this.requestBuilder.newShortcut(shortcut);
      this.http
        .post(this.system.config.tasksAdress, request, this.responsType)
        .subscribe(res => {
          if (res != RequestType.RequestFailed)
            this.localTasks.addFile(parent, shortcut, true, this.browserSync);
        });
    }
  }

  copyFiles(parent: Directory, files: FileItem[]) {
    for (var i = 0; i < files.length; i++) {
      var copiedFile = files[i].copy();
      if (this.offline)
        this.localTasks.addFile(parent, copiedFile, true, this.browserSync);
      else {
        var request = this.requestBuilder.copy(files[i], copiedFile, parent);
        this.http
          .post(this.system.config.tasksAdress, request, this.responsType)
          .subscribe(res => {
            if (res != RequestType.RequestFailed)
              this.localTasks.addFile(
                parent,
                copiedFile,
                true,
                this.browserSync
              );
          });
      }
    }
  }

  setStarStatus(files: FileItem[], status: boolean, notify: boolean) {
    if (notify)
      this.notifyStart.emit(this.noteCreator.fileStarStatus(files, status));
    var date = new FileDate();
    if (this.offline)
      this.localTasks.starStatus(status, files, date, this.browserSync);
    else {
      var request = this.requestBuilder.starStatus(files, status, date);
      this.http
        .post(this.system.config.tasksAdress, request, this.responsType)
        .subscribe(res => {
          if (res != RequestType.RequestFailed)
            this.localTasks.starStatus(status, files, date, this.browserSync);
          if (notify) this.notifyEnd.emit(res);
        });
    }
  }

  updateAccessDate(dir: Directory) {
    var date = new FileDate();
    if (this.offline)
      this.localTasks.updateAccessDate(dir, date, this.browserSync);
    else {
      var request = this.requestBuilder.accessDate(dir, date);
      this.http
        .post(this.system.config.tasksAdress, request, this.responsType)
        .subscribe(res => {
          if (res != RequestType.RequestFailed)
            this.localTasks.updateAccessDate(dir, date, this.browserSync);
        });
    }
  }

  removeShortcutsFromDownloadsList(files: FileItem[]) {
    var filteredList: FileItem[] = [];
    for (let i = 0; i < files.length; i++) {
      if (!files[i].isShortcut) filteredList.push(files[i]);
    }

    return filteredList;
  }

  private download(filename: string, downloadName: string, zip: boolean) {
    let path = "";
    if (zip) path = this.system.config.downloadUrl;
    else path = this.system.config.fileStorageUrl;
    this.invokeDownload.emit({ address: path + filename, name: downloadName });
  }

  downloadFiles(files: FileItem[]) {
    var filename = "download." + new FileDate().toString + ".zip";
    files = this.removeShortcutsFromDownloadsList(files);
    if (files.length == 0) return;
    var request = this.requestBuilder.download(files, filename);
    this.http
      .post(this.system.config.tasksAdress, request, this.responsType)
      .subscribe(res => {
        if (res != RequestType.RequestFailed)
          this.download(filename, filename, true);
      });
  }

  downloadSingleFile(file: File) {
    this.downloadFiles([file]);
  }

  /**********
   * Uploads
   ***********/
  uploadFile(fileItem, file, index = -1) {
    if (this.offline) {
      this.localTasks.addFile(
        fileItem.parent,
        fileItem,
        true,
        this.browserSync
      );
      if (index >= 0) this.uploadeDone.emit({ result: true, index: index });
    } else {
      var request = this.requestBuilder.newFile(fileItem, file);
      this.http
        .post(this.system.config.tasksAdress, request, {
          responseType: "text"
        })
        .subscribe(res => {
          if (res != RequestType.RequestFailed)
            this.localTasks.addFile(
              fileItem.parent,
              fileItem,
              true,
              this.browserSync
            );
          if (index >= 0) this.uploadeDone.emit({ result: res, index: index });
        });
    }
  }

  handleFileFromInput(jsFileObject, parent: Directory, index: number) {
    let file = this.setNewFile(jsFileObject, parent);
    this.uploadFile(file, jsFileObject, index);
  }

  /*************************
   * Drag and drop uploads
   ************************/
  async handleItemsFromDesktop(item, parent: Directory, index: number = -1) {
    if (item.isFile) {
      this.handleFileFromDesktop(item, parent, index);
    } else if (item.isDirectory) {
      this.handleDirFromDesktop(item, parent, index);
    }
  }

  async handleFileFromDesktop(item, parent: Directory, index: number = -1) {
    var fileObject = await this.getFileObject(item);
    let fileItem = this.setNewFile(fileObject, parent);
    this.uploadFile(fileItem, fileObject, index);
  }

  handleDirFromDesktop(item, parent: Directory, index: number = -1) {
    var dir = this.newDir(parent, item.name);
    var reader = item.createReader();
    this.readDir(reader, item, dir, index);
  }

  private readDir(reader, item, parent: Directory, index: number = -1) {
    var _this = this;
    reader.readEntries(function(entries) {
      if (entries.length > 0) {
        for (let i = 0; i < entries.length; i++) {
          _this.handleItemsFromDesktop(entries[i], parent, index);
        }
        _this.readDir(reader, item, parent, index);
      }
    });
  }

  // extracts javascript file object from FileEntry
  private async getFileObject(fileEntry) {
    try {
      return await new Promise((resolve, reject) =>
        fileEntry.file(resolve, reject)
      );
    } catch (err) {
      console.log(err);
    }
  }

  /*****************************
   * Directory upload from input
   ******************************/
  uploadDirectory(filesList, targetFolder, index = -1) {
    var foldersList = new Object();
    var path;
    var parent = "";
    for (var i = 0; i < filesList.length; i++) {
      // removes file name from path
      path = this.dropFileName(filesList[i].webkitRelativePath);
      parent = path.join("/");
      // if directory doesn't exist
      if (!foldersList[parent]) {
        // actual name of folder (without the rest of the path)
        var name = path[path.length - 1];
        var folderParent = this.getFolderParent(
          path,
          foldersList,
          targetFolder
        );
        foldersList[parent] = Directory.newDir(folderParent, name);
        this._newDir(foldersList[parent]);
      }
      this.uploadFile(
        this.setNewFile(filesList[i], foldersList[parent]),
        filesList[i],
        index
      );
    }
  }

  //drop filename from the end of a path
  dropFileName(path) {
    var newPath = path.split("/");
    newPath.pop();
    return newPath;
  }

  // gets the parent of a folder when uploading folders
  private getFolderParent(path: [], foldersList, targetFolder) {
    path.pop();
    var folderParent = foldersList[path.join("/")];
    if (!folderParent) folderParent = targetFolder;

    return folderParent;
  }
}
