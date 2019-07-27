import { Component, OnInit, Input } from "@angular/core";
import { DragAndDropIconService } from "src/app/services/file-manager/drag-and-drop-icon/drag-and-drop-icon.service";
import { PathBarService } from "src/app/services/file-manager/path-bar/path-bar.service";
import { PathBarStyle } from "../shared/path-bar-style";

@Component({
  selector: "path-bar-item",
  templateUrl: "./path-bar-item.component.html",
  styleUrls: ["./path-bar-item.component.css"]
})
export class PathBarItemComponent implements OnInit {
  @Input() index: number;
  public style = new PathBarStyle();
  constructor(
    public service: PathBarService,
    private dragAndDrop: DragAndDropIconService
  ) {}

  ngOnInit() {}

  get dir() {
    return this.service.path[this.index];
  }

  get name() {
    if (this.index) return this.dir.name;
    else "";
  }

  onClick(index: number) {
    this.service.openFolder(index);
  }

  onContextmenu(event: MouseEvent, index: number) {
    event.preventDefault();
  }

  onMouseOver(event, index: number) {
    if (this.dragAndDrop.isDragged) {
      let legit = this.service.isDragOverLegit(index);
      if (legit) this.style.draggedOver();
    } else this.style.over();
  }

  onMouseLeave() {
    this.style.normal();
  }

  onMouseUp(index: number) {
    this.service.dropFiles(index);
  }
}
