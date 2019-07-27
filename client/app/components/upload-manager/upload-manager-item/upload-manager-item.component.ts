import { Component, OnInit, Input } from "@angular/core";
import { UploadManagerService } from "src/app/services/upload-manager/upload-manager.service";

@Component({
  selector: "upload-manager-item",
  templateUrl: "./upload-manager-item.component.html",
  styleUrls: ["./upload-manager-item.component.css"]
})
export class UploadManagerItemComponent implements OnInit {
  @Input() index: number;
  private imposeStatusIcon: string;
  constructor(private uploadManager: UploadManagerService) {}

  ngOnInit() {}

  get status() {
    return this.uploadManager.status[this.index];
  }

  get item() {
    return this.uploadManager.getFile(this.index);
  }

  typeIcon() {
    let item = this.item;
    if (item && item.isFile) return "fas fa-file";
    else return "fas fa-folder";
  }
  getIconView() {
    var status = this.uploadManager.status[this.index];
    if (!status) return "";
    if (this.imposeStatusIcon) {
      return this.imposeIcon();
    } else {
      if (status.pending) return "upload-pending";
      else if (status.uploading) return "upload-level-one";
      if (status.done) return "upload-done far fa-check-circle";
      if (status.canceled) return "upload-canceled far fa-times-circle";
    }
  }

  imposeIcon() {
    if (this.imposeStatusIcon == "cancel") {
      return "far fa-times-circle";
    } else if (this.imposeStatusIcon == "restart") return "fas fa-undo-alt";
  }

  onMouseOver() {
    if (!this.uploadManager.processDone) {
      if (this.status.canceled) this.imposeStatusIcon = "restart";
      else if (this.status.pending) this.imposeStatusIcon = "cancel";
    }
  }

  onMouseLeave() {
    this.imposeStatusIcon = null;
  }

  onStatusIconClick() {
    this.imposeStatusIcon = null;
    if (!this.uploadManager.processDone) {
      var status = this.uploadManager.status[this.index];
      if (status.pending) this.uploadManager.cancelupload(this.index);
      else if (status.canceled) this.uploadManager.restartFile(this.index);
    }
  }
}
