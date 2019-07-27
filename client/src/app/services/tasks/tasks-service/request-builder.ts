import { RequestType } from "src/app/shared/enums/request-type";
import { FileItem } from "src/app/shared/models/file-system/file items/file-item";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { File } from "src/app/shared/models/file-system/file items/file/file";
import { Shortcut } from "src/app/shared/models/file-system/file items/shortcut";
import { FileDate } from "src/app/shared/models/file-system/file items/date/file-date";

export class RequestsBuilder {
  constructor(private username: string, private authKey: string) {}

  updateBasicData(username: string, authKey: string) {
    this.username = username;
    this.authKey = authKey;
  }

  private getFormData(request: RequestType) {
    var formData = new FormData();
    formData.append("username", this.username);
    formData.append("authKey", this.authKey);
    formData.append("request", request);

    return formData;
  }

  private boolToStr(val: boolean) {
    if (val) return "1";
    else return "0";
  }

  private fileListSerialization(
    files: FileItem[],
    formData: FormData,
    action: RequestType = null
  ) {
    for (var i = 0; i < files.length; i++) {
      formData.append("id[]", files[i].id);
      if (action && action == RequestType.Remove) {
        if (!files[i].isShortcut && files[i].isFile) {
          let _file: any = files[i];
          formData.append("type[]", _file.type);
          formData.append("extension[]", _file.extension);
        } else {
          formData.append("type[]", "0");
          formData.append("extension[]", "");
        }
      } else if (action == RequestType.Restore) {
        formData.append("updatedDir[]", files[i].parent.id);
      }
    }
  }

  private serializeForDownload(files: FileItem[], formData: FormData) {
    for (var i = 0; i < files.length; i++) {
      if (!files[i].isShortcut) formData.append("id[]", files[i].id);
    }
  }

  /**************
   * New files
   **************/
  private buildNewFile(formData: FormData, file: FileItem) {
    formData.append("id", file.id);
    formData.append("name", file.name);
    formData.append("type", file.type.toString());
    formData.append("parent", file.parent.id);
    formData.append("shares", file.status.shares.serialize());
    formData.append("deleted", this.boolToStr(file.status.deleted));
    formData.append("star", this.boolToStr(file.status.isStar));
    formData.append("creation_date", file.dates.creation.serialize());
    formData.append("access_date", file.dates.access.serialize());
    formData.append("modification_date", file.dates.modified.serialize());
    formData.append("note", file.note);

    if (file.isShortcut) {
      let shortcut: any = file;
      formData.append("reference", shortcut.reference.id);
    }
    if (file.isFile) {
      let _file: any = file;
      formData.append("size", _file.size.size);
      formData.append("extension", _file.extension);
    }

    return formData;
  }

  newDir(dir: Directory) {
    var formData = this.getFormData(RequestType.NewDir);
    this.buildNewFile(formData, dir);

    return formData;
  }

  newFile(file: File, uploadedFile) {
    var formData = this.getFormData(RequestType.NewFile);
    this.buildNewFile(formData, file);
    formData.append("file", uploadedFile);

    return formData;
  }

  newShortcut(file: Shortcut) {
    var formData = this.getFormData(RequestType.NewShortcut);
    this.buildNewFile(formData, file);

    return formData;
  }
  /****************************************************************/
  moveFiles(
    files: FileItem[],
    sourceDir: Directory,
    targetFolder: Directory,
    date: FileDate
  ) {
    var formData = this.getFormData(RequestType.Move);
    this.fileListSerialization(files, formData);
    formData.append("targetParent", targetFolder.id);
    formData.append("sourceParent", sourceDir.id);
    formData.append("date", date.serialize());

    return formData;
  }

  moveToTrash(files: FileItem[], date: FileDate) {
    var formData = this.getFormData(RequestType.Deletion);
    this.fileListSerialization(files, formData);
    formData.append("updatedDir[]", files[0].parent.id);
    formData.append("date", date.serialize());

    return formData;
  }

  restore(files: FileItem[], date: FileDate) {
    var formData = this.getFormData(RequestType.Restore);
    this.fileListSerialization(files, formData, RequestType.Restore);
    formData.append("date", date.serialize());

    return formData;
  }

  remove(files: FileItem[]) {
    var formData = this.getFormData(RequestType.Remove);
    this.fileListSerialization(files, formData, RequestType.Remove);

    return formData;
  }

  rename(file: FileItem, name: string, date: FileDate) {
    var formData = this.getFormData(RequestType.Rename);
    formData.append("id", file.id);
    formData.append("name", name);
    formData.append("date", date.serialize());

    return formData;
  }

  note(file: FileItem, note: string, date: FileDate) {
    var formData = this.getFormData(RequestType.UpdateNote);
    formData.append("id", file.id);
    formData.append("note", note);
    formData.append("date", date.serialize());

    return formData;
  }

  copy(sourceFile: FileItem, file: FileItem, target: Directory) {
    var formData = this.getFormData(RequestType.Copy);
    formData.append("source", sourceFile.id);
    this.buildNewFile(formData, file);
    return formData;
  }

  starStatus(files: FileItem[], status: boolean, date: FileDate) {
    var formData = this.getFormData(RequestType.StarStatus);
    this.fileListSerialization(files, formData);
    formData.append("status", this.boolToStr(status));
    formData.append("date", date.serialize());

    return formData;
  }

  download(files: FileItem[], filename: string) {
    var formData = this.getFormData(RequestType.Download);
    formData.append("filename", filename);
    this.serializeForDownload(files, formData);
    return formData;
  }

  accessDate(dir: Directory, date: FileDate) {
    var formData = this.getFormData(RequestType.AccessDate);
    formData.append("id", dir.id);
    formData.append("date", date.serialize());
  }
}
