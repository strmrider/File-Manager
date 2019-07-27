import { FileDate } from "src/app/shared/models/file-system/file items/date/file-date";
import { RequestType } from "src/app/shared/enums/request-type";

export class AccountRequestBuilder {
  constructor() {}

  login(username: string, password: string) {
    let formData = new FormData();
    let date = new FileDate();
    formData.append("request", RequestType.Login);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("loginDate", date.serialize());

    return formData;
  }

  autologin(username: string) {
    let formData = new FormData();
    let date = new FileDate();

    formData.append("request", RequestType.Autologin);
    formData.append("username", username);
    formData.append("loginDate", date.serialize());

    return formData;
  }

  newAccount(username: string, password: string, email: string) {
    let formData = new FormData();
    let date = new FileDate();

    formData.append("request", RequestType.NewAccount);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("email", email);
    formData.append("creationDate", date.serialize());
    formData.append("loginDate", date.serialize());

    return formData;
  }
}
