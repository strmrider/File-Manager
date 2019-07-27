import { Component, OnInit } from "@angular/core";
import { UIComponent } from "src/app/shared/enums/UIComponent";
import { Utilities } from "src/app/shared/utilities/utilities";
import { DragAndDropIconService } from "src/app/services/file-manager/drag-and-drop-icon/drag-and-drop-icon.service";

@Component({
  selector: "drag-and-drop-icon",
  templateUrl: "./drag-and-drop-icon.component.html",
  styleUrls: ["./drag-and-drop-icon.component.css"]
})
export class DragAndDropIconComponent implements OnInit {
  posX: string;
  posY: string;
  caption: string = "";
  amount: number = 0;
  private dragStarted: boolean = false;
  private firstMoves: number = 0;
  constructor(public service: DragAndDropIconService) {
    this.service.handleDragEmitter.subscribe(event => {
      this.handleDragging(event);
    });
    this.service.cleanDragStats.subscribe(() => this.endDrag());
  }

  ngOnInit() {}

  handleDragging(event) {
    if (this.dragStarted) this.drag(event);
    else if (this.service.mouseDown && this.firstMoves >= 5)
      this.startDrag(event);
    else if (this.service.mouseDown && this.firstMoves < 5) this.firstMoves++;
  }

  visibility(value: boolean) {
    return Utilities.visibility(value);
  }

  private endDrag() {
    if (this.dragStarted) {
      this.service.setMouseUp();
      this.dragStarted = false;
      this.service.drag = false;
      this.firstMoves = 0;
      this.service.hide();
    }
  }

  private startDrag(event: MouseEvent) {
    this.dragStarted = true;
    this.service.drag = true;
    this.setData();
    this.service.displayIcon();
    this.drag(event);
  }

  private drag(event: MouseEvent) {
    this.posX = event.clientX + 1 + "px";
    this.posY = event.clientY + 1 + "px";
  }

  private setData() {
    if (this.service.component == UIComponent.DirView) {
      this.caption = this.service.dragData.caption;
      this.amount = this.service.dragData.amount;
    } else if (this.service.component == UIComponent.NavigationTree)
      this.caption = this.service.dragData.caption;
  }
}
