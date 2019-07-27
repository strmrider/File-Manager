import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { FileType } from "src/app/shared/enums/file-type";
import { NavTreeService } from "src/app/services/file-manager/nav-tree/nav-tree.service";
import { FileManagerService } from "src/app/services/file-manager/file-manager-service/file-manager.service";
import { DragAndDropIconService } from "src/app/services/file-manager/drag-and-drop-icon/drag-and-drop-icon.service";
import { ContextmenuService } from "src/app/services/contextmenu/contextmenu-service/contextmenu.service";
import { UIComponent } from "src/app/shared/enums/UIComponent";
import { DirTreeStyle } from "../style/dir-tree-style";
import { Utilities } from "src/app/shared/utilities/utilities";
import { Comparisons } from "src/app/shared/utilities/copmarisons";

@Component({
  selector: "dir-tree",
  templateUrl: "./dir-tree.component.html",
  styleUrls: [
    "./dir-tree.component.css",
    "../style/nav-tree-selection-style.css",
    "../style/nav-tree-style.css"
  ]
})
export class DirTreeComponent implements OnInit {
  @ViewChild("toggleIcon") toggleIcon: ElementRef;
  @Input() dir: Directory;
  @Input() indentation: number;
  @Output() setDrag = new EventEmitter();
  style = new DirTreeStyle();
  dirsList: Directory[] = [];

  private _subDirsDisplay = false;
  private isSelected = false;
  private isDragged = false;
  /*subscriptions */
  private subscription: any;
  private selectionSubscription;
  private draggedSubscription;
  private dirOpenedSubscription;
  private toggleSubscription;
  private unselectRightClicked;

  constructor(
    private navTree: NavTreeService,
    private fileManager: FileManagerService,
    private dragAndDrop: DragAndDropIconService,
    private contextmenu: ContextmenuService
  ) {}

  ngOnInit() {
    this.init();
    let dir = this.actualDir();
    this.subscription = dir.dirsUpdates.subscribe(() => this.init());
    var firstLoad = this.dir.type == FileType.Root && !this.navTree.mainToggled;
    if (firstLoad) this.openDir(false);
    this.dirOpenedSubscription = dir.notifyAsOpen.subscribe(() => {
      if (this.navTree.mainToggled) {
        this.openDir(false);
        if (this.dir.type != FileType.Root)
          this.dir.parent.toggleEmitter.emit();
      } else {
        this.navTree.unselectPrevious.emit();
      }
    });

    this.toggleSubscription = dir.toggleEmitter.subscribe(() => {
      if (!this._subDirsDisplay) this.toggle();
      if (this.dir.type != FileType.Root) this.dir.parent.toggleEmitter.emit();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.selectionSubscription) this.selectionSubscription.unsubscribe();
    if (this.draggedSubscription) this.draggedSubscription.unsubscribe();
    this.dirOpenedSubscription.unsubscribe();
    this.toggleSubscription.unsubscribe();
  }

  dirNameClassName() {
    if (this.dir && this.dir.type == FileType.Root) return "main-dir-btn";
    else return "dir-btn";
  }

  icon() {
    return this.style.toggle(this.dir.type == FileType.Root);
  }

  iconClassName() {
    let className = "toggle-icon";
    if (this.dir && this.dir.type == FileType.Root) className += "-main";
    return className;
  }

  mainDirClassName() {
    if (this.dir && this.dir.type == FileType.Root) return "nav-tree-item";
    else return "";
  }

  subDirsDisplay() {
    return Utilities.visibility(this._subDirsDisplay);
  }

  toggle() {
    this._subDirsDisplay = !this._subDirsDisplay;
    if (this.dir.type == FileType.Root)
      this.navTree.mainToggle = this._subDirsDisplay;
    this.style.setToggle(this._subDirsDisplay);
  }

  /*Events*/
  reemit(status) {
    this.setDrag.emit(status);
  }

  onIconMouseOver() {
    if (this.dragAndDrop.isDragged && !this._subDirsDisplay) this.toggle();
  }

  onMouseDown(event: MouseEvent) {
    if (this.actualDir().isDirectory && event.which == 1) {
      this.navTree.pressedDir = this.dir;
      this.dragAndDrop.setMouseDown(
        { caption: this.dir.name },
        UIComponent.NavigationTree
      );
      if (event.target != this.toggleIcon.nativeElement) {
        this.dragAndDrop.unmarkNavTreeSelection();
        this.draggedSubscription = this.dragAndDrop.filesDragMark.subscribe(
          status => {
            if (this.dragAndDrop.component == UIComponent.NavigationTree)
              if (!status && this.isSelected) this.undrag();
              else this.markAsDragged(status);
          }
        );
      }
    }
  }

  onMouseUp(event: MouseEvent) {
    if (this.dragAndDrop.isDragged && this.navTree.legitDrag(this.dir)) {
      this.navTree.dropFiles(this.dir);
    } else if (
      event.target != this.toggleIcon.nativeElement &&
      !this.isSelected &&
      !this.dragAndDrop.isDragged &&
      event.which == 1
    ) {
      this.openDir();
    }
    this.dragAndDrop.setMouseUp();
  }

  markAsDragged(status: boolean) {
    this.isDragged = status;
    if (status) this.style.dragged();
    else this.unselect();
  }

  onMouseOver() {
    if (!this.isSelected && !this.isDragged && !this.unselectRightClicked)
      this.style.over();
    if (this.dragAndDrop.isDragged && this.navTree.legitDrag(this.dir)) {
      this.style.draggedOver();
    }
  }

  onMouseLeave() {
    if (!this.isSelected && !this.isDragged && !this.unselectRightClicked)
      this.style.normal();
    else if (this.isSelected && !this.isDragged) this.style.selected();
  }

  onContextmenu(event: MouseEvent) {
    event.preventDefault();
    if (this.dir.type == FileType.Root) return;
    this.fileManager.rightClickComponent = UIComponent.NavigationTree;
    this.navTree.rightClickedDir = this.dir;
    this.unselectRightClicked = this.navTree.unselectRightClicked.subscribe(
      () => {
        this.style.normal();
        this.unselectRightClicked.unsubscribe();
        this.unselectRightClicked = null;
      }
    );
    this.style.righClicked();
    this.contextmenu.showNavTreeItemMenu(
      event.clientX,
      event.clientY,
      !this.dir.status.isStar
    );
  }

  private init() {
    let list = this.actualDir().subDirs.toArray();
    Utilities.sort.quickSort(list, Comparisons.nameCmp);
    this.dirsList = list;
  }

  // returns reference if dir is a shortcut
  private actualDir(): Directory {
    let dir: any = this.dir;
    return dir.isShortcut ? dir.reference : dir;
  }

  private unselect() {
    if (this.selectionSubscription) this.selectionSubscription.unsubscribe();
    if (this.draggedSubscription) this.draggedSubscription.unsubscribe();
    this.isSelected = false;
    this.style.normal();
  }

  private undrag() {
    if (this.draggedSubscription) this.draggedSubscription.unsubscribe();
    this.style.selected();
    this.isDragged = false;
  }

  private openDir(openByClick = true) {
    this.isSelected = true;
    this.style.selected();
    this.navTree.openDir(this.actualDir(), openByClick);
    if (this.selectionSubscription) this.selectionSubscription.unsubscribe();
    this.selectionSubscription = this.navTree.unselectPrevious.subscribe(() =>
      this.unselect()
    );
  }
}
