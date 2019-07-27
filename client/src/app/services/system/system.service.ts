import { Injectable, EventEmitter } from "@angular/core";
import { FileSystem } from "src/app/shared/models/file-system/system/file-system";
import { HttpClient } from "@angular/common/http";
import { FilesOrganizer } from "src/app/shared/models/file-system/system/file-item-organizer";
import { SystemConfig } from "./config";
import { UserProfile } from "src/app/shared/models/user-profile";
import { RequestType } from "src/app/shared/enums/request-type";

@Injectable({
  providedIn: "root"
})
export class SystemService {
  private _profile: UserProfile;
  private _config: SystemConfig;
  private _fileSystem: FileSystem = new FileSystem();
  private _isSystemready: boolean = false;

  private configLoaded = new EventEmitter();
  private systemLoadReady = new EventEmitter();
  private loggedOut = new EventEmitter();
  private loggedIn = new EventEmitter();
  private _loader = new EventEmitter();
  autologin = new EventEmitter();
  updateProfile = new EventEmitter();

  constructor(private http: HttpClient) {}

  get username() {
    if (this.profile) return this.profile.username;
    else return undefined;
  }

  get profile() {
    return this._profile;
  }

  get config() {
    return this._config;
  }
  get fileSystem() {
    return this._fileSystem;
  }

  get isSystemReady() {
    return this._isSystemready;
  }
  get configLoadedEmitter() {
    return this.configLoaded;
  }

  get accountUrl() {
    return this.config.accountUrl;
  }

  get systemReadyEmitter() {
    return this.systemLoadReady;
  }

  get loggedOutEmitter() {
    return this.loggedOut;
  }

  get loggedInEmitter() {
    return this.loggedIn;
  }

  get loader() {
    return this._loader;
  }

  displayLoader(status: boolean) {
    this.loader.emit(status);
  }

  public updateAuthKey(authKey: string) {
    this.profile.authKey = authKey;
    this.updateProfile.emit();
  }

  public run() {
    var loggedName = window.localStorage.getItem(this.config.localStorageItem);
    if (this.config.autoLogin && loggedName) {
      this._isSystemready = false;
      this.autologin.emit(loggedName);
    } else {
      this._isSystemready = false;
      this.loggedOut.emit();
    }
  }

  public readConfigFile() {
    this.http.get("./assets/config.json").subscribe(data => {
      this._config = new SystemConfig(data);
      this.configLoaded.emit();
    });
  }

  public login(profile: UserProfile, saveUser: boolean) {
    this._profile = profile;
    if (saveUser)
      localStorage.setItem(this.config.localStorageItem, profile.username);

    this.config.guest = profile.isGuest;

    this.loadFileSystem();
    this.setNewLoginData(profile.username);
  }

  public refreshSystem() {
    if (this.profile.isGuest) this.loadOfflineSystem();
    else {
      this._isSystemready = false;
      this._fileSystem = new FileSystem();
      this.autologin.emit(this.profile.username);
    }
  }

  public logout() {
    window.localStorage.removeItem(this.config.localStorageItem);
    this._fileSystem = new FileSystem();
    this.loggedOut.emit();
  }

  private loadOfflineSystem() {
    this._fileSystem = new FileSystem();
    this.loadFileSystem();
    this.setNewLoginData(this.profile.username);
  }

  private setInFileSystem(filesFromServer) {
    let organizer = new FilesOrganizer(filesFromServer);
    this.fileSystem.setSystem(organizer.dirs, organizer.files);
    this._isSystemready = true;
    this.systemLoadReady.emit();
    this.displayLoader(false);
  }

  private loadFileSystem() {
    this.displayLoader(true);
    var form = new FormData();
    form.append("request", "100");
    form.append("authKey", this._profile.authKey);
    form.append("username", this._profile.username);
    this.http
      .post(this.config.tasksAdress, form, {
        responseType: "text"
      })
      .subscribe(res => {
        if (res != RequestType.RequestFailed) {
          let json = JSON.parse(res);
          this.setInFileSystem(json);
        }
      });
  }

  private setNewLoginData(username: string) {
    this.config.username = username;
    this.loggedIn.emit(this.username);
  }
}
