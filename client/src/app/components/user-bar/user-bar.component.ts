import { Component, OnInit } from "@angular/core";
import { SystemService } from "src/app/services/system/system.service";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "user-bar",
  templateUrl: "./user-bar.component.html",
  styleUrls: ["./user-bar.component.css"]
})
export class UserBarComponent implements OnInit {
  constructor(private system: SystemService) {}

  ngOnInit() {}

  logout() {
    this.system.logout();
  }

  get profile() {
    return this.system.profile;
  }

  totalStorage() {
    return Utilities.fileSizeFormat(this.system.fileSystem.storageSize);
  }

  refreshSystem() {
    this.system.refreshSystem();
  }

  serverMode() {
    if (this.system.config.offline) return "offline";
    else return "online";
  }

  serverModeTitle() {
    if (this.system.config.offline)
      return "Offlin mode. Changes will be commited on local files system only.";
    else return "Online mode";
  }
}
