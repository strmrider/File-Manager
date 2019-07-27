import { Injectable, EventEmitter } from "@angular/core";
import { SystemService } from "../system/system.service";
import { HttpClient } from "@angular/common/http";
import { AccountRequestBuilder } from "./models/account-request-builder";
import { AccountComponents } from "src/app/shared/enums/account-components";
import { UserProfile } from "src/app/shared/models/user-profile";
import { FileDate } from "src/app/shared/models/file-system/file items/date/file-date";
import { RequestType } from "src/app/shared/enums/request-type";
import { LocalSystemTasksService } from "../tasks/local-system-tasks/local-system-tasks.service";

@Injectable({
  providedIn: "root"
})
export class AccountService {
  private requestBuilder: AccountRequestBuilder;
  private _response = new EventEmitter();
  private componentDisplay = new EventEmitter();
  constructor(
    private system: SystemService,
    private localSysTasks: LocalSystemTasksService,
    private http: HttpClient
  ) {
    this.requestBuilder = new AccountRequestBuilder();
    this.system.loggedOutEmitter.subscribe(() => {
      this.componentDisplay.emit(AccountComponents.Login);
    });

    this.system.autologin.subscribe(username => {
      this.autologin(username);
    });
  }

  get responseEmitter() {
    return this._response;
  }

  get componentDisplayEmitter() {
    return this.componentDisplay;
  }

  login(username: string, password: string, saveUser: boolean) {
    let request = this.requestBuilder.login(username, password);
    this.commitLogin(request, saveUser);
  }

  guestLogin() {
    let date = new FileDate();
    let profile = new UserProfile(null, date, date, null, null);
    this.system.login(profile, false);
  }

  private autologin(username: string) {
    let request = this.requestBuilder.autologin(username);
    this.commitLogin(request, false);
  }

  private commitLogin(request: FormData, saveUser: boolean) {
    this.http
      .post(this.system.accountUrl, request, {
        responseType: "text"
      })
      .subscribe(res => {
        if (res != RequestType.RequestFailed) {
          this.system.displayLoader(true);
          let parse = JSON.parse(res);
          this.localSysTasks.notifyNewAuthKey(parse["authKey"]);
          this.system.login(this.setProfile(parse), saveUser);
        } else this._response.emit(res);
      });
  }

  createAccount(username: string, password: string, email: string) {
    var request = this.requestBuilder.newAccount(username, password, email);
    this.http
      .post(this.system.accountUrl, request, {
        responseType: "text"
      })
      .subscribe(res => {
        if (res != RequestType.RequestFailed) {
          this.system.displayLoader(true);
          let parse = JSON.parse(res);
          this.localSysTasks.notifyNewAuthKey(parse["authKey"]);
          this.system.login(this.setProfile(parse), true);
        } else this._response.emit(res);
      });
  }

  private setProfile(data: Object) {
    let registerData = new FileDate(data["creation_date"], false);
    let lastLogin = new FileDate(data["last_login"], false);
    return new UserProfile(
      data["username"],
      registerData,
      lastLogin,
      data["email"],
      data["authKey"]
    );
  }
}
