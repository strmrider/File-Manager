import { Component } from "@angular/core";
import { SystemService } from "./services/system/system.service";
import { AccountService } from "./services/account/account.service";
import { FileManagerService } from "./services/file-manager/file-manager-service/file-manager.service";
import { DirViewService } from "./services/file-manager/dir-view/dir-view-service/dir-view.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "FileManager";

  constructor(
    private system: SystemService,
    private account: AccountService,
    private fileManager: FileManagerService,
    private dirView: DirViewService
  ) {
    this.initSystem();
  }

  private initSystem() {
    this.system.configLoadedEmitter.subscribe(() => {
      this.system.run();
      //this.system.logout();
    });
    this.system.readConfigFile();
  }
}
