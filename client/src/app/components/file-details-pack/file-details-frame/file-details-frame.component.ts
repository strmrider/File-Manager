import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FileManagerService } from "src/app/services/file-manager/file-manager-service/file-manager.service";
import { DirViewService } from "src/app/services/file-manager/dir-view/dir-view-service/dir-view.service";
import { FileType } from "src/app/shared/enums/file-type";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "file-details",
  templateUrl: "./file-details-frame.component.html",
  styleUrls: ["./file-details-frame.component.css"]
})
export class FileDetailsFrameComponent implements OnInit {
  @Output() toggleDetails = new EventEmitter();
  private _visibility: boolean = false;
  constructor(
    private fileManager: FileManagerService,
    private dirView: DirViewService
  ) {
    this.fileManager.fileDetailsEmitter.subscribe(file => {
      this._visibility = true;
      this.toggleDetails.emit(true);
    });
  }

  ngOnInit() {}

  get file() {
    let file = this.dirView.lastSelectedFile;
    if (file) return file;
    else return this.dirView.currentDir;
  }

  legitFile() {
    return (
      this.file &&
      (this.file.isDirectory ||
        this.file.isShortcut ||
        this.file.type == FileType.Root ||
        this.file.isFile)
    );
  }

  visibility() {
    return Utilities.visibility(this._visibility);
  }

  visibilityClass() {
    if (this._visibility) return "-closed";
    else return "";
  }

  close() {
    this._visibility = false;
    this.toggleDetails.emit(false);
  }
}
