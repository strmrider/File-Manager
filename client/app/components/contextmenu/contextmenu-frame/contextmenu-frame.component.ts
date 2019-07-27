import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ContextmenuService } from "src/app/services/contextmenu/contextmenu-service/contextmenu.service";

@Component({
  selector: "contextmenu-frame",
  templateUrl: "./contextmenu-frame.component.html",
  styleUrls: ["./contextmenu-frame.component.css"]
})
export class ContextmenuFrameComponent implements OnInit {
  @ViewChild("container") container: ElementRef;
  constructor(public service: ContextmenuService) {}

  ngOnInit() {
    this.service.container = this.container;
  }

  visibility() {
    if (this.service.visibility) return "visible";
    else return "hidden";
  }

  clear() {
    this.service.close();
  }

  getClassName() {
    if (this.service.visibility) return "open";
    else return "closed";
  }
}
