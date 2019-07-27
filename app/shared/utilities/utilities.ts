import { Sort } from "./sort";
import { FileSize } from "../models/file-system/file items/file/file-size";

export class Utilities {
  static sort = new Sort();
  constructor() {}

  static generateId() {
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  static visibility(status: boolean) {
    if (status) return "block";
    else return "none";
  }

  static getExtension(name: string) {
    var extension = "";
    for (let i = name.length - 1; i >= 0; i--) {
      if (name[i] == ".") break;
      extension += name[i];
    }

    return extension
      .split("")
      .reverse()
      .join("");
  }

  static reverseStr(str: string) {
    var newStr = "";
    for (var i = str.length - 1; i >= 0; i--) {
      newStr += str[i];
    }

    return newStr;
  }
  static fileSizeFormat(size: number) {
    let format = FileSize.optimize(size);
    return format.size.toFixed(2) + " " + format.unit;
  }
}
