import { FileItem } from "src/app/shared/models/file-system/file items/file-item";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { FileSystemTasks } from "src/app/shared/enums/files-system-tasks";

export class TaskNotificationCreator {
  constructor() {}

  fileTransfer(files: FileItem[], source: Directory, target: Directory) {
    return {
      files: files,
      source: source,
      target: target,
      task: FileSystemTasks.Transfer,
      startMessage: "Moving files",
      endMessage: "Moved " + files.length + " files"
    };
  }

  fileRemoval(files: FileItem[], source: Directory) {
    return {
      files: files,
      source: source,
      task: FileSystemTasks.Remove,
      startMessage: "Removing files",
      endMessage: "Removed " + files.length + " files"
    };
  }

  removeFromTrash(files: FileItem[]) {
    return {
      files: files,
      task: FileSystemTasks.RemoveFromTrash,
      startMessage: "Removing files from trash",
      endMessage: "Removed " + files.length + " files from trash"
    };
  }

  fileRename(file: FileItem, oldName: string) {
    return {
      file: file,
      name: oldName,
      task: FileSystemTasks.Rename,
      startMessage: "Renaming file",
      endMessage: "File renamed"
    };
  }

  fileStarStatus(files: FileItem[], status: boolean) {
    return {
      files: files,
      status: status,
      task: FileSystemTasks.Star,
      startMessage: this.starStatusMessage(true, files.length, status),
      endMessage: this.starStatusMessage(false, files.length, status)
    };
  }

  fileRestore(files: FileItem[]) {
    return {
      files: files,
      task: FileSystemTasks.Restore,
      startMessage: "Restoring files",
      endMessage: files.length + " files restored"
    };
  }

  private starStatusMessage(start: boolean, size: number, status: boolean) {
    if (start) {
      if (status) return "Moving to starred";
      else return "Removing from starred";
    } else {
      if (status) return "moved " + size + " files to starred";
      else return "removed " + size + " files from starred";
    }
  }
}
