import { UploadStatus } from "src/app/shared/enums/upload-status";

export class ItemUploadStatus {
  private _status: UploadStatus;
  private uploads: number = 0;
  constructor(private total = 1) {
    this._status = UploadStatus.Pending;
  }

  get status() {
    return this._status;
  }

  set status(status: UploadStatus) {
    this._status = status;
  }

  get pending() {
    return this._status == UploadStatus.Pending;
  }

  get uploading() {
    return this._status == UploadStatus.Uploading;
  }
  get canceled() {
    return this._status == UploadStatus.Canceled;
  }

  get reuploading() {
    return this._status == UploadStatus.Reupload;
  }

  get failed() {
    return this._status == UploadStatus.Failed;
  }

  get done() {
    return this._status == UploadStatus.Done;
  }

  get uploaded() {
    return this.uploads;
  }
  get totalItems() {
    return this.total;
  }

  setPending() {
    this._status = UploadStatus.Pending;
  }

  uploadDone() {
    if (this.total > 0) this.uploads++;
    if (this.uploads == this.total) this._status = UploadStatus.Done;
  }

  upload() {
    this._status = UploadStatus.Uploading;
  }
  cancel() {
    this._status = UploadStatus.Canceled;
  }

  reupload() {
    this._status = UploadStatus.Reupload;
  }

  fail() {
    this._status = UploadStatus.Failed;
  }
}
