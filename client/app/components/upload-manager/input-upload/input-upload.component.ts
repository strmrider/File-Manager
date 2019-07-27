import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { UploadMethod } from "src/app/shared/enums/upload-method";
import { FileManagerService } from "src/app/services/file-manager/file-manager-service/file-manager.service";
import { UploadManagerService } from "src/app/services/upload-manager/upload-manager.service";

@Component({
  selector: "input-upload",
  templateUrl: "./input-upload.component.html",
  styleUrls: ["./input-upload.component.css"]
})
export class InputUploadComponent implements OnInit {
  @ViewChild("filesUplaod") filesUpload: ElementRef;
  @ViewChild("folderUpload") folderUpload: ElementRef;
  constructor(
    private fileManager: FileManagerService,
    private uploadManager: UploadManagerService
  ) {
    this.uploadManager.inputUploadEmitter.subscribe(type => this.invoke(type));
  }

  ngOnInit() {}

  filesUploadOnChange(event) {
    var files = event.target.files;
    this.uploadManager.setData(
      files,
      this.fileManager.currentViewedDir,
      UploadMethod.InputFiles
    );
    this.uploadManager.start();
  }

  folderUploadOnChange(event) {
    event.preventDefault();
    var dirFiles = event.target.files;
    this.uploadManager.setData(
      dirFiles,
      this.fileManager.currentViewedDir,
      UploadMethod.InputDirectory
    );
    this.uploadManager.start();
  }

  invoke(type) {
    if (type == 0) this.filesUpload.nativeElement.click();
    else this.folderUpload.nativeElement.click();
  }
}
