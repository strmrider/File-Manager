import { Component, OnInit, Input } from "@angular/core";
import { NavTreeStyle } from "../style/nav-tree-style";
import { NavTreeService } from "src/app/services/file-manager/nav-tree/nav-tree.service";
import { DragAndDropIconService } from "src/app/services/file-manager/drag-and-drop-icon/drag-and-drop-icon.service";
import { FileType } from "src/app/shared/enums/file-type";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";

@Component({
  selector: "nav-tree-item",
  templateUrl: "./nav-tree-item.component.html",
  styleUrls: [
    "./nav-tree-item.component.css",
    "../style/nav-tree-selection-style.css",
    "../style/nav-tree-style.css"
  ]
})
export class NavTreeItemComponent implements OnInit {
  @Input() caption: string;
  @Input() icon: string;
  @Input() targetDir: Directory;
  style = new NavTreeStyle();
  private isSelected = false;
  private subscription;
  constructor(
    private service: NavTreeService,
    private dragAndDrop: DragAndDropIconService
  ) {}

  ngOnInit() {}

  onMouseDown() {
    if (!this.isSelected) {
      this.isSelected = true;
      this.style.selected();
      this.service.openDir(this.targetDir);
      this.subscription = this.service.unselectPrevious.subscribe(() =>
        this.unselect()
      );
    }
  }

  onMouseUp() {
    if (this.dragAndDrop.isDragged && this.targetDir.type == FileType.Trash)
      this.service.systemFoldersOperations(this.targetDir);
  }

  onMouseOver() {
    if (!this.isSelected) this.style.over();
    if (this.dragAndDrop.isDragged && this.targetDir.type == FileType.Trash)
      this.style.draggedOver();
  }

  onMouseLeave() {
    if (!this.isSelected) this.style.normal();
  }

  private unselect() {
    this.subscription.unsubscribe();
    this.isSelected = false;
    this.style.normal();
  }
}
