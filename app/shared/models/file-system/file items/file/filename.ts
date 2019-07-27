import { Utilities } from "src/app/shared/utilities/utilities";

export class Filename {
  private name: string;
  private _extension: string;

  constructor(fullname: string) {
    this.init(fullname);
  }

  private init(fullname: string) {
    var splittedFilename = this.splitFilename(fullname);

    this.name = splittedFilename[0];
    this._extension = splittedFilename[1];
  }

  get extension() {
    return this._extension;
  }

  private splitFilename(fullname: string) {
    var splitted = ["", ""];
    var currentStr = "";
    for (var i = fullname.length - 1; i >= 0; i--) {
      if (fullname[i] == ".") {
        splitted[1] = currentStr;
        currentStr = "";
      } else if (i - 1 < 0) {
        currentStr += fullname[i];
        splitted[0] = currentStr;
      } else currentStr += fullname[i];
    }

    splitted[0] = Utilities.reverseStr(splitted[0]);
    splitted[1] = Utilities.reverseStr(splitted[1]);

    return splitted;
  }

  get fullname() {
    return this.name + "." + this._extension;
  }

  rename(fullname: string) {
    this.init(fullname);
  }
}
