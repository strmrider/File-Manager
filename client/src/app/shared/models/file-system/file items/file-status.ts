import { FileShares } from "./file-shares";

export class FileStatus {
  constructor(
    private _deleted: boolean = false,
    private _starred: boolean = false,
    private _shares: FileShares = new FileShares()
  ) {}

  get isStar() {
    return this._starred;
  }

  get isShared() {
    return this._shares.count > 0;
  }

  get shares() {
    return this._shares;
  }

  get deleted() {
    return this._deleted;
  }

  set deleted(deleted: boolean) {
    this._deleted = deleted;
  }

  set star(status: boolean) {
    this._starred = status;
  }
}
