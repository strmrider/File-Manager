import { FileDate } from "./file-system/file items/date/file-date";

export class UserProfile {
  private guest: boolean = false;
  constructor(
    private _username: string,
    private _registerDate: FileDate,
    private _lastLogin: FileDate,
    private _email: string,
    // authentication key
    private _authKey: string
  ) {
    if (!_username) this.guest = true;
  }

  get username() {
    if (this.guest) return "Guest";
    else return this._username;
  }

  get registerDate() {
    return this._registerDate;
  }

  get lastLogin() {
    return this._lastLogin;
  }

  get email() {
    return this._email;
  }

  get isGuest() {
    return this.guest;
  }

  get authKey() {
    if (this.guest) return "0";
    return this._authKey;
  }

  set authKey(authKey: string) {
    this._authKey = authKey;
  }
}
