import { Injectable } from "@angular/core";
import { ContextMenuDataDefiner } from "../../shared/contextmenu-items-definer";
import { TasksService } from "src/app/services/tasks/tasks-service/tasks.service";
import { DirViewService } from "src/app/services/file-manager/dir-view/dir-view-service/dir-view.service";

@Injectable({
  providedIn: "root"
})
export class TrashItemMenuService extends ContextMenuDataDefiner {
  constructor(private tasks: TasksService, private dirView: DirViewService) {
    super();
  }

  setItems() {
    this._items = [
      this.setItem("Restore", "fas fa-recycle", this.restore.bind(this)),
      this.setItem(
        "Remove from trash",
        "fas fa-trash-alt",
        this.removeFromTrash.bind(this)
      )
    ];
  }

  get items() {
    return this._items;
  }

  /*Operations*/
  private restore() {
    this.tasks.restore(this.dirView.selectedFiles, true);
  }

  private removeFromTrash() {
    this.tasks.deleteFromTrash(this.dirView.selectedFiles, true);
  }
}
