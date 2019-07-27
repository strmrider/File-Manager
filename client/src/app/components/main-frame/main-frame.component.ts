import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SystemService } from "src/app/services/system/system.service";
import { ContextmenuService } from "src/app/services/contextmenu/contextmenu-service/contextmenu.service";
import { TasksService } from "src/app/services/tasks/tasks-service/tasks.service";

@Component({
  selector: "main-frame",
  templateUrl: "./main-frame.component.html",
  styleUrls: ["./main-frame.component.css"]
})
export class MainFrameComponent implements OnInit {
  @ViewChild("downloader") downloader: ElementRef;
  public systemLoaded = false;
  constructor(
    private system: SystemService,
    private contextmenu: ContextmenuService,
    private tasks: TasksService
  ) {
    this.subscriptions();
    this.docContextmenuEvents();
  }

  ngOnInit() {}

  private subscriptions() {
    this.system.systemReadyEmitter.subscribe(() => {
      this.systemLoaded = true;
    });

    this.system.loggedOutEmitter.subscribe(() => {
      this.systemLoaded = false;
    });

    this.tasks.invokeDowbloadEmitter.subscribe(data =>
      this.invokeDownload(data)
    );
  }

  private docContextmenuEvents() {
    document.addEventListener("mousedown", evt => {
      let elm = evt.target as HTMLElement;
      if (!elm.classList.contains("contextmenu-related")) {
        this.contextmenu.close();
      }
    });

    document.addEventListener("contextmenu", evt => {
      evt.preventDefault();
    });
  }

  public invokeDownload(data) {
    this.downloader.nativeElement.download = data.name;
    this.downloader.nativeElement.href = data.address;
    this.downloader.nativeElement.click();
  }
}
