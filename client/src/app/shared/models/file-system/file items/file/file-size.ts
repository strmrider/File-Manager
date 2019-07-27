export class FileSize {
  constructor(private _size: number) {}

  get size() {
    return this._size;
  }

  get kilobyte() {
    return this.size / 1000;
  }

  get megabyte() {
    return this.size / 1000000;
  }

  get gigabyte() {
    return this.size / (1000000 * 1000);
  }

  optimize() {
    let res = FileSize.optimize(this._size);
    return res.size + " " + res.unit;
  }

  static optimize(size: number) {
    var unit = 0;
    var strUnit = "";
    while (size > 1000) {
      size /= 1000;
      unit++;
    }

    if (unit == 0) strUnit = "B";
    else if (unit == 1) strUnit = "KB";
    else if (unit == 2) strUnit = "MB";
    else if (unit == 3) strUnit = "GB";

    return { size: size, unit: strUnit };
  }
}
