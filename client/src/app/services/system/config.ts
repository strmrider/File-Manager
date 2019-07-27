export class SystemConfig {
  private _username: string = "";
  private _guest;
  constructor(private data: Object) {}

  get accountUrl() {
    return this.data["address"]["login"];
  }

  get localStorageItem() {
    return this.data["loging"]["localStorageItem"];
  }

  get autoLogin() {
    return this.data["loging"]["autologin"];
  }
  get tasksAdress() {
    return this.data["address"]["tasks"];
  }

  get fileStorageUrl() {
    return this.data["address"]["storage"]["files"] + this._username + "/";
  }

  get iconsUrl() {
    return this.data["address"]["storage"]["icons"] + "/";
  }

  get downloadUrl() {
    return this.data["address"]["download"] + "/";
  }

  get offline() {
    if (this._guest) return true;
    else return this.data["mode"]["offline"];
  }

  get browserSynch() {
    if (this.offline) return false;
    else return this.data["mode"]["browserSynch"];
  }

  get isGuest() {
    return this._guest;
  }

  set username(username: string) {
    this._username = username;
  }

  set guest(isGuest) {
    this._guest = isGuest;
  }
}
