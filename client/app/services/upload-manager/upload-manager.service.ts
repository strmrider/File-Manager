import { Injectable, EventEmitter } from "@angular/core";
import { ItemUploadStatus } from "./model/item-upload-status";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { UploadMethod } from "src/app/shared/enums/upload-method";
import { TasksService } from "../tasks/tasks-service/tasks.service";

@Injectable({
  providedIn: "root"
})
export class UploadManagerService {
  public status: Array<ItemUploadStatus>;
  private files: Array<any>;
  private method: UploadMethod;
  private parent: Directory;
  private ready: boolean = false;
  private inputUpload = new EventEmitter();
  // current uploading process data
  private index: number = 0;
  private uploads: number = 0;
  private totalUploads: number = 0;
  private inProgress: boolean = false;

  private _visible: boolean = false;
  constructor(private tasks: TasksService) {
    this.tasks.uploadDoneEmitter.subscribe(res => this.uploadRequestDone(res));
  }

  get totalSize() {
    if (this.files) return this.files.length;
    else return 0;
  }
  get visible() {
    return this._visible;
  }

  get inputUploadEmitter() {
    return this, this.inputUpload;
  }

  set visible(status) {
    this._visible = status;
  }

  get processDone() {
    return this.uploads == this.totalUploads || !this.inProgress;
  }

  get uploaded() {
    return this.uploads;
  }
  get total() {
    return this.totalUploads;
  }

  get filesList() {
    return this.files;
  }

  public invokeInputUpload(type) {
    this.inputUpload.emit(type);
  }

  public prepareFilesList(filesList) {
    if (this.method == UploadMethod.DragAndDrop) {
      this.files = [];
      for (let i = 0; i < filesList.length; i++) {
        this.files.push(filesList[i].webkitGetAsEntry());
      }
    } else if (this.method == UploadMethod.InputDirectory) {
      var name = this.tasks.dropFileName(filesList[0].webkitRelativePath);
      name = name.join("/");
      this.files = this.singleDirUplaod(name, filesList);
    } else this.files = filesList;
  }

  public getFile(index: number) {
    return this.files[index];
  }

  public setData(files: any[], parent: Directory, method: UploadMethod) {
    this.inProgress = false;
    this.method = method;
    this.parent = parent;
    this.ready = this.method != UploadMethod.DragAndDrop;
    this.prepareFilesList(files);
    this.setSatusList(files.length);
    this.index = 0;
    this.uploads = 0;
    this.totalUploads = this.files.length;
  }

  public start() {
    this.inProgress = true;
    this._visible = true;
    if (this.files.length > 0 && this.ready) {
      this.uploadFile(0);
    }
  }

  public cancelupload(index: number) {
    this.status[index].cancel();
    this.totalUploads--;
  }

  public restartFile(index: number) {
    this.totalUploads++;
    if (this.index > index) {
      this.uploadFile(index);
    } else this.status[index].setPending();
  }

  public cancelProcess() {
    this.inProgress = false;
  }

  public resumeProcess() {
    this.inProgress = true;
    if (this.moveNext()) this.uploadFile(this.index);
  }

  private singleDirUplaod(name: string, filesList) {
    return [{ name: name, isDirectory: true, files: filesList }];
  }

  private dirDeepTreeSize(dir, index) {
    var size = { count: 0 };
    this.traverseDirectory(dir, size).then(() => {
      this.status[index] = new ItemUploadStatus(size.count);
      this.checkIfReady(index);
    });
  }

  private checkIfReady(index) {
    if (this.status.length == index + 1) {
      this.ready = true;
      if (this.inProgress) this.start();
    }
  }

  private initStatusList(length) {
    this.status = [];
    for (let i = 0; i < length; i++) this.status.push(new ItemUploadStatus());
  }

  private async setSatusList(length) {
    this.initStatusList(length);
    if (this.method == UploadMethod.InputFiles) {
      for (let i = 0; i < length; i++) this.status[i] = new ItemUploadStatus();
    } else if (this.method == UploadMethod.DragAndDrop) {
      for (let i = 0; i < length; i++) {
        if (this.files[i].isDirectory) {
          await this.dirDeepTreeSize(this.files[i], i);
        } else {
          this.status[i] = new ItemUploadStatus();
          this.checkIfReady(i);
        }
      }
    } else if (this.method == UploadMethod.InputDirectory) {
      this.status = new Array<ItemUploadStatus>(1);
      this.status[0] = new ItemUploadStatus(length);
    }
  }

  private handleEmptyDir(index: number) {
    this.tasks.newDir(this.parent, this.getFile(index).name);
    this.status[index].uploadDone();
    if (!this.status[index].reuploading) {
      this.uploadNext();
    }
  }

  private uploadFile(index: number) {
    if (this.status[index].totalItems == 0) {
      this.handleEmptyDir(index);
      return;
    }

    if (this.method == UploadMethod.DragAndDrop) {
      let item = this.getFile(index);
      if (item.isFile)
        this.tasks.handleFileFromDesktop(item, this.parent, index);
      else this.tasks.handleDirFromDesktop(item, this.parent, index);
    } else if (this.method == UploadMethod.InputFiles)
      this.tasks.handleFileFromInput(
        this.files[index],
        this.parent,
        this.index
      );
    else if (this.method == UploadMethod.InputDirectory) {
      this.tasks.uploadDirectory(this.files[0].files, this.parent, 0);
    }
    this.status[index].upload();
  }

  private uploadRequestDone(response: {}) {
    var index = response["index"];
    var status = this.status[index];
    if (response["result"]) {
      status.uploadDone();
      if (status.done) {
        this.uploads++;
        if (!status.reuploading) {
          this.uploadNext();
        }
      }
    } else status.fail();
  }

  private moveNext() {
    while (
      this.index < this.files.length - 1 &&
      !this.status[this.index].pending
    ) {
      this.index++;
    }
    if (this.index < this.files.length) return this.status[this.index].pending;
    else return false;
  }

  private uploadNext() {
    let res = this.moveNext();
    if (res && this.inProgress) {
      this.uploadFile(this.index);
    }
  }

  private async traverseDirectory(entry, size) {
    let reader = entry.createReader();
    var _this = this;
    return new Promise(resolve_directory => {
      var iteration_attempts = [];
      (async function read_entries() {
        reader.readEntries(entries => {
          if (!entries.length) {
            resolve_directory(Promise.all(iteration_attempts));
          } else {
            iteration_attempts.push(
              Promise.all(
                entries.map(entry => {
                  if (entry.isFile) {
                    size.count++;
                    return entry;
                  } else {
                    return _this.traverseDirectory(entry, size);
                  }
                })
              )
            );
            read_entries();
          }
        }, null);
      })();
    });
  }
}
