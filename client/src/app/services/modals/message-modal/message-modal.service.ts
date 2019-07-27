import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class MessageModalService {
  private _display = new EventEmitter();
  constructor() {}

  get displatEmitter() {
    return this._display;
  }

  display(title: string, message: string) {
    this._display.emit({ title: title, message: message });
  }
}
