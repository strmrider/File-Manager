import { Injectable, EventEmitter } from "@angular/core";
import { TasksService } from "../../tasks/tasks-service/tasks.service";
import { DirViewService } from "../../file-manager/dir-view/dir-view-service/dir-view.service";
import { FileItem } from "src/app/shared/models/file-system/file items/file-item";
import { NameModalType } from "src/app/shared/enums/name-modal-type";

@Injectable({
  providedIn: "root"
})
export class NameModalService {
  private _type: NameModalType;
  private _file: FileItem = null;
  private _display = new EventEmitter();
  constructor(private tasks: TasksService, private dirView: DirViewService) {}

  get type() {
    return this._type;
  }

  get displayEmitter() {
    return this._display;
  }

  get file() {
    return this._file;
  }

  get renameTitle() {
    return "Rename";
  }

  get newDirTitle() {
    return "New folder";
  }

  display(type: NameModalType, file: FileItem) {
    this._file = file;
    this._type = type;
    this._display.emit();
  }

  execute(name: string) {
    if (this.type == 0) {
      if (this.file.name != name) this.tasks.rename(this.file, name, true);
    } else if (this.type == 1) this.tasks.newDir(this.dirView.currentDir, name);
  }
}
