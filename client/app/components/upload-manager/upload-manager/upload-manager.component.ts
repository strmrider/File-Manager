import { Component, OnInit } from "@angular/core";
import { UploadManagerService } from "src/app/services/upload-manager/upload-manager.service";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "upload-manager",
  templateUrl: "./upload-manager.component.html",
  styleUrls: ["./upload-manager.component.css"]
})
export class UploadManagerComponent implements OnInit {
  private fullOpen = true;
  constructor(public uploadManager: UploadManagerService) {}

  ngOnInit() {}

  visibility() {
    return Utilities.visibility(this.uploadManager.visible);
  }

  exitClick() {
    if (this.uploadManager.processDone) {
      this.uploadManager.visible = false;
    } else this.uploadManager.cancelProcess();
  }

  uploadListVisibility() {
    return this.minVisible();
  }

  minVisible() {
    if (this.fullOpen) return "block";
    else return "none";
  }

  maxVisible() {
    if (this.fullOpen) return "none";
    else return "block";
  }

  changeSize() {
    this.fullOpen = !this.fullOpen;
  }

  cancelBtnView(index: number) {
    if (this.uploadManager.status[index].pending) return "block";
  }
}
