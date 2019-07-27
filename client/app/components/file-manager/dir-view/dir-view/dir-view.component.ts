import {
  Component,
  OnInit,
  HostListener,
  ViewChildren,
  QueryList,
  ViewChild,
  ElementRef,
  EventEmitter
} from "@angular/core";
import { FileViewComponent } from "../file-view/file-view.component";
import { DragSelectionBoxComponent } from "../drag-selection-box/drag-selection-box.component";
import { ContextmenuService } from "src/app/services/contextmenu/contextmenu-service/contextmenu.service";
import { DragAndDropIconService } from "src/app/services/file-manager/drag-and-drop-icon/drag-and-drop-icon.service";
import { DirViewService } from "src/app/services/file-manager/dir-view/dir-view-service/dir-view.service";
import { DirViewDisplayModeService } from "src/app/services/file-manager/dir-view/dir-view-display-mode/dir-view-display-mode.service";
import { TasksService } from "src/app/services/tasks/tasks-service/tasks.service";
import { UIComponent } from "src/app/shared/enums/UIComponent";
import { FileType } from "src/app/shared/enums/file-type";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "dir-view",
  templateUrl: "./dir-view.component.html",
  styleUrls: ["./dir-view.component.css"]
})
export class DirViewComponent implements OnInit {
  @HostListener("document:keyup", ["$event"])
  handleHostListener(event: KeyboardEvent) {
    this.handleKeyboardEvent(event);
  }

  files: any[];
  bgColor = "";
  opacity = 1;
  @ViewChild("dragSelectionBox") selectionBox: DragSelectionBoxComponent;
  @ViewChild("mainContainer") public child: ElementRef;
  @ViewChildren("fileItem") private childFiles: QueryList<FileViewComponent>;
  // at least one file was covered by selection box
  private atLeastOneCovered = false;
  private filesSelection = new EventEmitter();
  private markAsDraggedEmitter = new EventEmitter();

  constructor(
    public service: DirViewService,
    private contextmenu: ContextmenuService,
    private dragAndDrop: DragAndDropIconService,
    private tasks: TasksService,
    public mode: DirViewDisplayModeService
  ) {
    this.files = this.service.filesList;
    this.service.selectAllEmitter.subscribe(() => this.selectAll());
    dragAndDrop.filesDragMark.subscribe(status => {
      if (this.dragAndDrop.component == UIComponent.DirView)
        this.markDraggedFiles(status);
    });
  }

  ngOnInit() {
    this.winEvents();
  }

  /****************************
   * scrollbar methods
   ***************************/
  private currentScrollbarMaxHeight() {
    return (
      this.child.nativeElement.scrollHeight -
      this.child.nativeElement.offsetHeight
    );
  }

  private isScrolledToBottom() {
    return (
      this.child.nativeElement.scrollTop == this.currentScrollbarMaxHeight()
    );
  }

  private isScrollBarExist() {
    var container = this.child.nativeElement;
    return container.clientHeight != container.scrollHeight;
  }

  getScrollbarWidth() {
    if (this.isScrollBarExist()) return 10;
    else return 0;
  }

  scrollContainer(mouseY: number) {
    var container = this.child.nativeElement;
    var containerRect = container.getBoundingClientRect();
    // calculates the position of the container's bottom
    var containerBottom = containerRect.height + containerRect.top;

    if (this.isScrollBarExist()) {
      // scroll up
      if (mouseY < containerRect.top && container.scrollTop != 0) {
        container.scrollBy(0, -10);
        return 10;
      }
      // scroll down
      else if (mouseY > containerBottom && !this.isScrolledToBottom()) {
        container.scrollBy(0, 10);
        return -10;
      }
    }
    return 0;
  }

  filesTotalSizeFormat() {
    if (this.service.totalSelectedSize > 0) {
      return Utilities.fileSizeFormat(this.service.totalSelectedSize);
    }
  }

  /****************************
   * Child components emitions
   ***************************/
  getDragIconData() {
    var lastPressedFile = this.service.filesList[this.service.lastPressedIndex];
    return { name: lastPressedFile.name, number: this.service.count };
  }

  markDraggedFiles(status: boolean) {
    this.markAsDraggedEmitter.emit(status);
  }

  /* Emitted by FileComponent*/
  getOverAllDraggingData() {
    return {
      files: this.dragAndDrop.isDragged,
      box: this.selectionBox.isDragged
    };
  }

  isCovered(pos) {
    if (this.selectionBox.isCovered(pos)) {
      this.atLeastOneCovered = true;
      return true;
    }
    return false;
  }

  /***********
   * Events
   ***********/
  onMouseDown(event) {
    if (event.which == 1 && event.target == this.child.nativeElement) {
      if (!event.ctrlKey && this.containerClicked(event)) {
        this.unselectAll();
      }
      window.getSelection().removeAllRanges();
      this.selectionBox.setMouseDown();
    }
  }

  onMosueUp(event) {
    this.selectionBox.endDrag(event);
    this.atLeastOneCovered = false;
    this.dragAndDrop.handleDrag(event);
  }

  onContextmenu(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.containerClicked(event)) {
      this.unselectAll();
      if (
        this.service.currentDir.type == FileType.Root ||
        this.service.currentDir.isDirectory
      )
        this.contextmenu.showBackgroundMenu(event.clientX, event.clientY);
    }
  }

  onDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    this.service.dropFromDesktop(event.dataTransfer.items);
    this.bgColor = "";
    this.opacity = 1;
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    if (
      event.dataTransfer.types[0] == "Files" &&
      !this.service.isCurrentTrash
    ) {
      this.bgColor = "#3636b6";
      this.opacity = 0.5;
    } else event.dataTransfer.dropEffect = "none";
  }

  onDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();
    this.bgColor = "";
    this.opacity = 1;
  }

  private handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === "a" && event.ctrlKey) {
      this.selectAll();
    } else if (event.key === "Delete") {
      if (this.service.currentDir.type == FileType.Trash)
        this.tasks.deleteFromTrash(this.service.selectedFiles, true);
      else this.tasks.removeFiles(this.service.selectedFiles);
    }
  }

  private winEvents() {
    var _this = this;

    window.addEventListener("mousemove", function(evt) {
      _this.dragAndDrop.handleDrag(evt);
      _this.selectionBox.handleDrag(evt);
    });

    window.addEventListener("mouseup", function(evt) {
      _this.dragAndDrop.endDrag();
      _this.selectionBox.endDrag(evt);
    });
  }

  private containerClicked(event) {
    var size = this.child.nativeElement.getBoundingClientRect();
    // calculates width without scrollbar's width
    var width = size.width + size.left - 10;
    var height = size.height + size.top + 10;
    var inWidth = event.clientX <= width && event.clientX >= size.left;
    var inWHeight = event.clientY <= height && event.clientY >= size.top;

    return inWidth && inWHeight && event.target == this.child.nativeElement;
  }

  private unselectAll() {
    this.filesSelection.emit(false);
    this.service.unselectAllItems();
  }

  private selectAll() {
    this.filesSelection.emit(true);
  }
}
