import { Injectable } from "@angular/core";
import { ContextMenuDataDefiner } from "../../shared/contextmenu-items-definer";
import { FileManagerService } from "src/app/services/file-manager/file-manager-service/file-manager.service";
import { UploadManagerService } from "src/app/services/upload-manager/upload-manager.service";
import { NameModalService } from "src/app/services/modals/name-modal/name-modal.service";
import { DirViewService } from "src/app/services/file-manager/dir-view/dir-view-service/dir-view.service";

@Injectable({
  providedIn: "root"
})
export class DirViewBackgroundMenuService extends ContextMenuDataDefiner {
  constructor(
    private fileManager: FileManagerService,
    private dirView: DirViewService,
    private uploadManager: UploadManagerService,
    private nameModal: NameModalService
  ) {
    super();
  }

  setItems() {
    this._items = [
      this.setItem(
        "New folder",
        "fas fa-folder-plus",
        this.newFolder.bind(this)
      ),
      this.setItem("hr/"),
      this.setItem(
        "Upload files",
        "fas fa-file-upload",
        this.uploadFiles.bind(this)
      ),
      this.setItem(
        "Upload folder",
        "fas fa-upload",
        this.folderUpload.bind(this)
      ),
      this.setItem("hr/"),
      this.setItem("Details", "fas fa-info-circle", this.details.bind(this))
    ];
  }

  get items() {
    return this._items;
  }

  newFolder() {
    this.nameModal.display(1, this.dirView.lastSelectedFile);
  }

  uploadFiles() {
    this.uploadManager.invokeInputUpload(0);
  }

  folderUpload() {
    this.uploadManager.invokeInputUpload(1);
  }

  details() {
    this.fileManager.displayFilesDetails();
  }
}
