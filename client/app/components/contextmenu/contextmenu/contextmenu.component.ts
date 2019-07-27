import { Component, OnInit, Input } from "@angular/core";
import { ContextMenuDataDefiner } from "src/app/services/contextmenu/shared/contextmenu-items-definer";
import { FileItemMenuService } from "src/app/services/contextmenu/menus/file-item-menu/file-item-menu.service";
import { DirViewBackgroundMenuService } from "src/app/services/contextmenu/menus/dir-view-background-menu/dir-view-background-menu.service";
import { TrashItemMenuService } from "src/app/services/contextmenu/menus/trash-item-menu/trash-item-menu.service";
import { ContextmenuService } from "src/app/services/contextmenu/contextmenu-service/contextmenu.service";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "contextmenu",
  templateUrl: "./contextmenu.component.html",
  styleUrls: ["./contextmenu.component.css"]
})
export class ContextmenuComponent implements OnInit {
  @Input() type: string;
  items: any[];
  private service: ContextMenuDataDefiner;

  constructor(
    private fileItemMenu: FileItemMenuService,
    private backgroundMenu: DirViewBackgroundMenuService,
    private trashMenu: TrashItemMenuService,
    private contextmenu: ContextmenuService
  ) {}

  ngOnInit() {
    if (this.type == "file") this.service = this.fileItemMenu;
    else if (this.type == "background") this.service = this.backgroundMenu;
    else if (this.type == "trash") this.service = this.trashMenu;
    this.items = this.service.items;
  }

  visibility() {
    if (this.service.status) return "visible";
    else return "hidden";
  }

  itemVisibility(status: boolean) {
    return Utilities.visibility(status);
  }

  click(item) {
    this.contextmenu.close();
    item.execution();
  }
}
