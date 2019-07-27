import { ComparisonResult } from "src/app/shared/enums/comparison-result";

export class FileDate {
  private _year: Number;
  private _mounth: Number;
  private _day: Number;

  private _hour: Number;
  private _minute: Number;
  private _second: Number;

  constructor(date: any = null, isDateObject: boolean = true) {
    if (date) {
      if (isDateObject) {
        this.setByDateObject(date);
      } else this.setByStr(date);
    } else {
      this.setByDateObject(new Date());
    }
  }

  get year() {
    return this._year;
  }

  get mounth() {
    return this._mounth;
  }

  get day() {
    return this._day;
  }

  get hour() {
    return this._hour;
  }

  get minute() {
    return this._minute;
  }

  get second() {
    return this._second;
  }

  setByStr(date: string) {
    return this.deserialize(date);
  }

  // sate as object
  setByJSONparsedObject(date) {
    this._year = date._year;
    this._mounth = date._mounth;
    this._day = date._day;

    this._hour = date._hour;
    this._minute = date._minute;
    this._second = date._second;
  }

  // set by Date object
  setByDateObject(date: Date) {
    this._year = date.getFullYear();
    this._mounth = date.getMonth() + 1;
    this._day = date.getDate();

    this._hour = date.getHours();
    this._minute = date.getMinutes();
    this._second = date.getSeconds();
  }

  copy(date: FileDate) {
    this._year = date.year;
    this._mounth = date.mounth;
    this._day = date.day;

    this._hour = date.hour;
    this._minute = date.minute;
    this._second = date.second;
  }

  serializeDate() {
    return this._mounth + "." + this._day + "." + this.year;
  }

  serializeTime() {
    return this._hour + ":" + this._minute + ":" + this._second;
  }

  serialize() {
    return this.serializeDate() + "-" + this.serializeTime();
  }

  get toString() {
    return (
      this._mounth +
      "" +
      this._day +
      this.year +
      this._hour +
      "" +
      this._minute +
      "" +
      this._second
    );
  }

  getDate() {
    return this.serializeDate() + " " + this.serializeTime();
  }

  setInSuitibleVar(str, counter) {
    switch (counter) {
      case 0:
        this._mounth = str;
        return;
      case 1:
        this._day = str;
        return;
      case 2:
        this._year = str;
        return;
      case 3:
        this._hour = str;
        return;
      case 4:
        this._minute = str;
        return;
      case 5:
        this._second = str;
        return;
    }
  }

  deserialize(date: string) {
    var counter = 0;
    var str = "";
    for (var i = 0; i < date.length + 1; i++) {
      if (
        date[i] == "." ||
        date[i] == "-" ||
        date[i] == ":" ||
        i == date.length
      ) {
        this.setInSuitibleVar(str, counter);
        counter++;
        str = "";
      } else str += date[i];
    }
  }

  // gets Date object
  update(newDate: any, copy = false) {
    if (copy) this.copy(newDate);
    else this.setByDateObject(newDate);
  }

  private valueCmp(value1: Number, value2: Number) {
    if (value1 > value2) return ComparisonResult.Greater;
    else if (value1 < value2) return ComparisonResult.Lesser;
    else return ComparisonResult.Equal;
  }

  private compareDate(date: FileDate) {
    var res = this.valueCmp(this.year, date.year);
    if (res == ComparisonResult.Equal) {
      res = this.valueCmp(this.mounth, date.mounth);
      if (res == ComparisonResult.Equal) {
        res = this.valueCmp(this.day, date.day);
      }
    }

    return res;
  }

  private compareTime(date: FileDate) {
    var res = this.valueCmp(this.hour, date.hour);
    if (res == ComparisonResult.Equal) {
      res = this.valueCmp(this.minute, date.minute);
      if (res == ComparisonResult.Equal) {
        res = this.valueCmp(this.second, date.second);
      }
    }

    return res;
  }

  compare(date: FileDate) {
    var res = this.compareDate(date);
    if (res == 0) return this.compareTime(date);
    else return res;
  }
}
