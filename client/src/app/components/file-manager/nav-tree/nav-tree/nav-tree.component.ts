import { Component, OnInit, ViewChild } from "@angular/core";
import { NavTreeService } from "src/app/services/file-manager/nav-tree/nav-tree.service";
import { ContextmenuService } from "src/app/services/contextmenu/contextmenu-service/contextmenu.service";

@Component({
  selector: "nav-tree",
  templateUrl: "./nav-tree.component.html",
  styleUrls: ["./nav-tree.component.css"]
})
export class NavTreeComponent implements OnInit {
  constructor(
    public service: NavTreeService,
    private contextmenu: ContextmenuService
  ) {}

  ngOnInit() {}

  onMouseDown() {
    let dir = this.service.rightClickedDir;
    if (dir) {
      this.service.unselectRightClicked.emit();
    }
    this.contextmenu.close();
  }
}
