import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { AccountService } from "src/app/services/account/account.service";
import { AccountComponents } from "src/app/shared/enums/account-components";
import { SystemService } from "src/app/services/system/system.service";
import { RequestType } from "src/app/shared/enums/request-type";

@Component({
  selector: "create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.css"]
})
export class CreateAccountComponent implements OnInit {
  @ViewChild("username") usernameInput: ElementRef;
  @ViewChild("password") passwordInput: ElementRef;
  @ViewChild("email") emailInput: ElementRef;

  usernameError = "";
  passwordError = "";
  emailError = "";
  errorMessage = "";
  private _display = false;
  constructor(private account: AccountService, private system: SystemService) {
    this.account.responseEmitter.subscribe(res => {
      if (res == RequestType.RequestFailed)
        this.errorMessage = "Username is already taken.";
    });

    this.account.componentDisplayEmitter.subscribe(component => {
      if (component == AccountComponents.Registration) {
        this.initErrorMessages();
        this._display = true;
      } else this._display = false;
    });

    this.system.loggedInEmitter.subscribe(() => {
      this._display = false;
    });
  }

  ngOnInit() {}

  get display() {
    return this._display;
  }

  signIn() {
    this.account.componentDisplayEmitter.emit(AccountComponents.Login);
  }

  creatAccount() {
    let username = this.usernameInput.nativeElement.value;
    let password = this.passwordInput.nativeElement.value;
    let email = this.emailInput.nativeElement.value;
    if (this.inputValidation(username, password, email))
      this.account.createAccount(username, password, email);
  }

  private inputValidation(username: string, password: string, email: string) {
    this.initErrorMessages();
    return (
      this.usernameValidation(username) &&
      this.passwordValidation(password) &&
      this.emailValidation(email)
    );
  }

  private initErrorMessages() {
    this.errorMessage = "";
    this.usernameError = "";
    this.passwordError = "";
    this.emailError = "";
  }

  /*******************
   * Input validation
   *******************/
  private usernameValidation(username: string) {
    let len = username.length;
    if (len == 0) {
      this.usernameError = "Please insert username.";
      return false;
    } else if (len < 6 || len > 30) {
      this.usernameError = "Username must be 6–30 characters long.";
      return false;
    } else {
      username = username.toLocaleLowerCase();
      for (let i = 0; i < username.length; i++) {
        if (
          !username[i].match(/[a-z]/i) &&
          username[i].match(/[0-9]/i) &&
          username[i] != "."
        ) {
          this.usernameError =
            "Usernames can contain letters (a-z), numbers (0-9), and periods (.).";
          return false;
        }
      }
    }

    return true;
  }

  private passwordValidation(password: string) {
    let len = password.length;
    if (len == 0) {
      this.passwordError = "Please insert password.";
      return false;
    } else if (len < 8 || len > 32) {
      this.passwordError = "Password must be 8–32 characters long.";
      return false;
    } else {
      if (/\s/.test(password)) {
        this.passwordError = "Password must not contain whitespaces.";
        return false;
      }
    }
    return true;
  }

  private emailValidation(email: string) {
    let len = email.length;
    if (len == 0) {
      this.emailError = "Please insert password.";
      return false;
    } else {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (re.test(String(email).toLowerCase())) {
        this.emailError = "Invaild email address.";
        return false;
      }
    }
    return true;
  }
}
