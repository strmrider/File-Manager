import { File } from "../file items/file/file";
import { Shortcut } from "../file items/shortcut";
import { FileType } from "src/app/shared/enums/file-type";
import { FileItem } from "../file items/file-item";
import { Directory } from "../file items/directory/directory";
import { FileDatesList } from "../file items/date/file-dates-list";
import { FileStatus } from "../file items/file-status";
import { FileTypesHandler } from "../file items/file/file-types-handler";

export class FilesOrganizer {
  private _dirs = new Object();
  private _files = new Object();
  constructor(jsonFiles) {
    this.organize(jsonFiles);
  }

  get dirs() {
    return this._dirs;
  }

  get files() {
    return this._files;
  }

  private add(item: FileItem) {
    if (item.isDirectory || item.type == FileType.Root) {
      this._dirs[item.id] = item;
    } else {
      this._files[item.id] = item;
    }
  }

  private organize(jsonFiles: []) {
    for (var i = 0; i < jsonFiles.length; i++) {
      this.add(this.parseItem(jsonFiles[i]));
    }
  }

  private parseItem(jsonFile) {
    var type = FileTypesHandler.convertFromDB(parseInt(jsonFile["type"]));
    var status = new FileStatus(
      this.intToBool(parseInt(jsonFile["deleted"])),
      this.intToBool(parseInt(jsonFile["star"])),
      jsonFile["shares"]
    );

    var dates = new FileDatesList(
      jsonFile["creation_date"],
      jsonFile["access_date"],
      jsonFile["modification_date"]
    );

    var item: FileItem;
    if (type == FileType.Root) {
      item = new Directory(
        jsonFile["name"],
        jsonFile["id"],
        type,
        null,
        status,
        dates,
        jsonFile["note"]
      );
    } else if (type == FileType.Directory) {
      item = new Directory(
        jsonFile["name"],
        jsonFile["id"],
        type,
        jsonFile["parent"],
        status,
        dates,
        jsonFile["note"]
      );
    } else if (type == FileType.Shortcut) {
      item = new Shortcut(
        jsonFile["reference"],
        jsonFile["name"],
        jsonFile["id"],
        type,
        jsonFile["parent"],
        status,
        dates,
        jsonFile["note"]
      );
    } else
      item = new File(
        jsonFile["id"],
        jsonFile["name"],
        jsonFile["extension"],
        parseInt(jsonFile["size"]),
        type,
        jsonFile["parent"],
        status,
        dates,
        jsonFile["note"]
      );
    return item;
  }

  private intToBool(int: number) {
    if (int == 0) return false;
    else return true;
  }
}
