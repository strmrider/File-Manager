import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { SystemService } from "src/app/services/system/system.service";
import { FileManagerService } from "src/app/services/file-manager/file-manager-service/file-manager.service";
import { DirViewService } from "src/app/services/file-manager/dir-view/dir-view-service/dir-view.service";
import { ContextmenuService } from "src/app/services/contextmenu/contextmenu-service/contextmenu.service";
import { DragAndDropIconService } from "src/app/services/file-manager/drag-and-drop-icon/drag-and-drop-icon.service";
import { DirViewDisplayModeService } from "src/app/services/file-manager/dir-view/dir-view-display-mode/dir-view-display-mode.service";
import { FileType } from "src/app/shared/enums/file-type";
import { FileTypesHandler } from "src/app/shared/models/file-system/file items/file/file-types-handler";
import { UIComponent } from "src/app/shared/enums/UIComponent";
import { FileViewStyle } from "./style/file-view-style";
import { FilePreviewService } from "src/app/services/file-preview/file-preview.service";
import { File } from "src/app/shared/models/file-system/file items/file/file";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "file-view",
  templateUrl: "./file-view.component.html",
  styleUrls: [
    "./file-view.component.css",
    "./style/grid-mode.css",
    "./style/list-mode.css",
    "./style/selection-style.css"
  ]
})
export class FileViewComponent implements OnInit {
  public style = new FileViewStyle();
  @ViewChild("container") element: ElementRef;
  @ViewChild("video") videoThumbnail: ElementRef;
  @Output() public unselectAll = new EventEmitter();
  @Input() public file: any;

  @Input() private index: number;
  @Input() private draggingData: Function;
  @Input() private isCovered: Function;
  @Input() private selectionEmitter: any;
  @Input() private markAsDraggedEmitter: any;

  private opacity: number;
  private currentMode;

  private isSelected: Boolean = false;
  private interval: any;
  private subscriptions = [];
  private src = "";
  constructor(
    private system: SystemService,
    private fileManager: FileManagerService,
    private dirView: DirViewService,
    private contextmenu: ContextmenuService,
    private dragAndDrop: DragAndDropIconService,
    private filePreview: FilePreviewService,
    public mode: DirViewDisplayModeService
  ) {}

  ngOnInit() {
    this.currentMode = this.mode;
    this.interval = setInterval(() => this.onCover());
    this.subscriptions.push(
      this.selectionEmitter.subscribe(status => {
        this.selectionEmitting(status);
      })
    );
    this.subscriptions.push(
      this.markAsDraggedEmitter.subscribe(status => this.markAsDragged(status))
    );
    this.setFileImage();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    for (let i = 0; i < this.subscriptions.length; i++)
      this.subscriptions[i].unsubscribe();
  }

  getContainer() {
    return this.mode.current["fileContainer"];
  }

  listModeSize() {
    if (this.file.isFile) {
      return Utilities.fileSizeFormat(this.file.size.size);
    } else return "-";
  }

  listModeStarred() {
    if (this.file.status.isStar) {
      return "fas fa-star";
    } else return "";
  }

  isImage() {
    return this.file.type == FileType.Image;
  }

  isVideo() {
    return this.file.type == FileType.Video;
  }

  isMedia() {
    return (
      this.file.type == FileType.Image ||
      this.file.type == FileType.Video ||
      this.file.type == FileType.Audio
    );
  }

  getActualFile() {
    return this.file.isShortcut ? this.file.reference : this.file;
  }

  onContextmenu(evt) {
    if (!this.isSelected) this.clickItem(event);
    this.dirView.lastPressedIndex = this.index;
    if (this.dirView.currentDir.type == FileType.Trash)
      this.contextmenu.showTrashMenu(evt.clientX, evt.clientY);
    else {
      this.fileManager.rightClickComponent = UIComponent.DirView;
      this.contextmenu.showFileItemMenu(
        evt.clientX,
        evt.clientY,
        this.file.isShortcut
          ? this.file.reference.isDirectory
          : this.file.isDirectory,
        this.dirView.nonStarredItems
      );
    }
  }

  onMouseDown(event: any) {
    if (event.which == 1) {
      window.getSelection().removeAllRanges();
      this.clickItem(event);
      if (!(event.ctrlKey && this.isSelected) && !this.dirView.isCurrentTrash) {
        this.dragAndDrop.setMouseDown(
          { caption: this.file.name, amount: this.dirView.count },
          UIComponent.DirView
        );
      }

      this.dirView.lastPressedIndex = this.index;
    }
  }

  onMouseUp(event) {
    if (
      event.which == 1 &&
      !event.ctrlKey &&
      !this.draggingData().box &&
      !this.dragAndDrop.isDragged
    ) {
      this.unselectAll.emit();
      this.select();
    } else if (
      this.dragAndDrop.isDragged &&
      !this.isSelected &&
      this.getActualFile().isDirectory &&
      this.dirView.isDragOverLegit(this.file)
    ) {
      this.dirView.dropFiles(this.getActualFile());
    }
    this.dragAndDrop.setMouseUp();
  }

  onMouseOver(event) {
    event.stopPropagation();
    var areFilesDragged = this.draggingData().files;
    if (
      this.dragAndDrop.isDragged &&
      !this.isSelected &&
      this.getActualFile().isDirectory &&
      this.dirView.isDragOverLegit(this.file)
    ) {
      this.style.draggedOver();
    } else if (
      !areFilesDragged &&
      !this.isSelected &&
      !this.dragAndDrop.isDragged
    )
      this.style.over();
  }

  onMouseLeave(event) {
    if (!this.isSelected) this.style.normal();
    var areFilesDragged = this.draggingData().files;
    if (areFilesDragged && !this.isSelected && this.file.isDirectory) {
      this.style.normal();
    }
  }

  onDoubleClick() {
    let file = this.file;
    if (this.file.isShortcut) file = this.file.reference;
    if (this.dirView.currentDir.type != FileType.Trash) {
      if (file.isDirectory) this.dirView.loadNewDir(file);
      else {
        let cast: any = this.dirView.lastSelectedFile;
        let file: File = cast;
        this.filePreview.display(file);
      }
    }
  }

  onDrop(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.file.isDirectory)
      this.dirView.dropFromDesktop(event.dataTransfer.items, this.index);
    this.style.normal();
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    if (this.file.isDirectory && event.dataTransfer.types[0] == "Files")
      this.style.draggedOver();
    else event.dataTransfer.dropEffect = "none";
  }

  onDragLeave(event) {
    event.stopPropagation();
    event.preventDefault();
    this.style.normal();
  }

  // the method checks if the element is covered by selection box
  onCover() {
    var position = this.element.nativeElement.getBoundingClientRect();
    if (this.isCovered(position)) {
      if (!this.isSelected) this.select();
    } else if (this.draggingData().box && this.isSelected) this.unselect();
  }

  // Video thumbnail mouse events
  videoThumbnailPlay(play: boolean) {
    var video = this.videoThumbnail.nativeElement;
    if (play) {
      video.volume = 0;
      video.play();
    } else {
      video.currentTime = 0;
      video.pause();
    }
  }

  onVideoOver() {
    var areFilesDragged = this.draggingData().files || this.draggingData().box;
    if (!areFilesDragged) this.videoThumbnailPlay(true);
  }

  onVideoLeave() {
    var areFilesDragged = this.draggingData().files || this.draggingData().box;
    if (!areFilesDragged) this.videoThumbnailPlay(false);
  }

  private setFileImage() {
    var type = this.file.type;
    var file = this.file;
    var img = "";

    if (type == FileType.Shortcut) {
      if (this.file.reference && !this.file.reference.status.deleted) {
        type = this.file.reference.type;
        file = this.file.reference;
      } else img = "error.png";
    }

    if (img.length == 0) {
      switch (type) {
        case FileType.Directory:
          img = "folder.png";
          //if (!file.isEmpty) img = "folder_contain.png";
          break;
        case FileType.Image:
        case FileType.Video:
          this.src = this.system.config.fileStorageUrl + file.filename;
          return;
        case FileType.Audio:
          img = "audio.png";
          break;
        default:
          let _file: any = file;
          img = FileTypesHandler.icon(_file.extension) + ".png";
          break;
      }
    }

    this.src = this.system.config.iconsUrl + img;
  }

  private selectionEmitting(status) {
    var notify = true;
    if (this.dirView.fullSelection) notify = false;
    if (status && !this.isSelected) this.select(notify);
    else if (!status && this.isSelected) this.unselect(notify);
  }

  private select(notify = true) {
    this.isSelected = true;
    this.style.selected();
    if (notify) this.dirView.selectItem(this.index);
  }

  private unselect(notify = true) {
    this.isSelected = false;
    this.style.normal();
    if (notify) this.dirView.unselectItem(this.index);
  }

  private markAsDragged(status = true) {
    if (status && this.isSelected) this.style.dragged();
    else {
      if (!this.isSelected) this.style.normal();
      else this.style.selected();
    }
  }

  private clickItem(event: any) {
    if (!event.ctrlKey && !this.isSelected) {
      this.unselectAll.emit();
    }
    if (!this.isSelected) {
      this.select();
    } else if (this.isSelected && event.ctrlKey) this.unselect();
  }
}
