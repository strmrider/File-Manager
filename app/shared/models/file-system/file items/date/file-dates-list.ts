import { FileDate } from "./file-date";

export class FileDatesList {
  private _creation: FileDate;
  private _access: FileDate;
  private _modified: FileDate;

  constructor(
    creationDate: FileDate = null,
    accessDate: FileDate = null,
    modifiedDate: FileDate = null
  ) {
    this._creation = new FileDate(creationDate, false);
    this._access = new FileDate(accessDate, false);
    this._modified = new FileDate(modifiedDate, false);
  }

  get creation() {
    return this._creation;
  }

  get access() {
    return this._access;
  }

  get modified() {
    return this._modified;
  }

  replace(dates: FileDatesList) {
    this._creation = dates.creation;
    this._access = dates.access;
    this._modified = dates.modified;
  }

  setByJSONparsedObject(dates) {
    this._creation.setByJSONparsedObject(dates._creation);
    this._access.setByJSONparsedObject(dates._access);
    this._modified.setByJSONparsedObject(dates._modified);
  }
}
