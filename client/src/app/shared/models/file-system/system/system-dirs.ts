import { FileType } from "src/app/shared/enums/file-type";
import { Directory } from "../file items/directory/directory";
import { FileStatus } from "../file items/file-status";
import { FileDatesList } from "../file items/date/file-dates-list";
import { Utilities } from "src/app/shared/utilities/utilities";

export class SystemDirs {
  root: Directory;
  trash: Directory;
  starred: Directory;
  shared: Directory;
  constructor() {
    this.root = this.generateSystemDir(
      "Main",
      FileType.Root,
      "0",
      new FileStatus(),
      new FileDatesList()
    );
    this.trash = this.generateSystemDir(
      "Trash",
      FileType.Trash,
      Utilities.generateId()
    );
    this.starred = this.generateSystemDir(
      "Starred",
      FileType.Starred,
      Utilities.generateId()
    );

    this.shared = this.generateSystemDir(
      "Shared",
      FileType.Shared,
      Utilities.generateId()
    );
  }

  generateSystemDir(name, type, id, status = null, dates = null) {
    return new Directory(name, id, type, null, status, dates, "");
  }
}
