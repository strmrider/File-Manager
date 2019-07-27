import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AccountService } from "src/app/services/account/account.service";
import { AccountComponents } from "src/app/shared/enums/account-components";
import { SystemService } from "src/app/services/system/system.service";
import { RequestType } from "src/app/shared/enums/request-type";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  @ViewChild("username") usernameInput: ElementRef;
  @ViewChild("password") passwordInput: ElementRef;

  private _display = false;
  errorMessage: string = "";
  private autologin: boolean = true;
  constructor(private account: AccountService, private system: SystemService) {
    this.setSubscriptions();
  }

  ngOnInit() {}

  newAccount() {
    this.account.componentDisplayEmitter.emit(AccountComponents.Registration);
  }

  get display() {
    return this._display;
  }

  autologinCheckBoxClick() {
    this.autologin = !this.autologin;
  }

  login() {
    if (this.checkInputsValues())
      this.account.login(
        this.usernameInput.nativeElement.value,
        this.passwordInput.nativeElement.value,
        this.autologin
      );
  }

  demoUser() {
    this.usernameInput.nativeElement.value = "demo.user";
    this.passwordInput.nativeElement.value = "demo.user";
    this.autologin = false;
  }

  private checkInputsValues() {
    let username = this.usernameInput.nativeElement.value.length;
    let password = this.passwordInput.nativeElement.value.length;
    if (username == 0 && password == 0)
      this.errorMessage = "Please insert username and password";
    else if (username == 0) this.errorMessage = "Please insert username";
    else if (password == 0) this.errorMessage = "Please insert password";
    else return true;
  }

  private setSubscriptions() {
    this.account.componentDisplayEmitter.subscribe(component => {
      if (component == AccountComponents.Login) {
        this.errorMessage = "";
        this._display = true;
      } else this._display = false;
    });

    this.system.loggedInEmitter.subscribe(() => {
      this._display = false;
    });

    this.account.responseEmitter.subscribe(res => {
      if (res == RequestType.RequestFailed) {
        this.errorMessage = "Invalid username or password";
      }
    });
  }
}
