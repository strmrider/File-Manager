import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { DirViewService } from "src/app/services/file-manager/dir-view/dir-view-service/dir-view.service";
import { ContextmenuService } from "src/app/services/contextmenu/contextmenu-service/contextmenu.service";
import { DirViewDisplayModeService } from "src/app/services/file-manager/dir-view/dir-view-display-mode/dir-view-display-mode.service";
import { FileType } from "src/app/shared/enums/file-type";
import { FilesIconSize } from "src/app/shared/enums/files-icons-size";
import { SortType } from "src/app/shared/enums/sort-type";

@Component({
  selector: "toolbar",
  templateUrl: "./toolbar.component.html",
  styleUrls: ["./toolbar.component.css"]
})
export class ToolbarComponent implements OnInit {
  @ViewChild("search") searchInput: ElementRef;
  bgColor = "";
  private ascendingOrder = true;
  constructor(
    private dirView: DirViewService,
    private contextmenu: ContextmenuService,
    public mode: DirViewDisplayModeService
  ) {
    this.dirView.toolbarEmitter.subscribe(data => {
      if (data == "not_found") this.bgColor = "#ff8484";
      if (data == "found") this.bgColor = "";
      else if (data == "clear") this.clearSearchBox();
    });
  }

  ngOnInit() {}

  changeMode() {
    this.mode.changeMode();
  }

  orderIcon() {
    if (this.ascendingOrder) return "fas fa-sort-amount-down";
    else return "fas fa-sort-amount-up";
  }

  changeOrder() {
    this.ascendingOrder = !this.ascendingOrder;
    this.dirView.changeFilesListOrder();
  }

  openMenu(event: MouseEvent) {
    let lastFile = this.dirView.lastSelectedFile;
    if (lastFile)
      this.contextmenu.showFileItemMenu(
        event.clientX + 2,
        event.clientY + 2,
        lastFile.isDirectory,
        lastFile.status.isStar
      );
    else if (this.dirView.currentDir.type == FileType.Trash)
      this.contextmenu.showTrashMenu(event.clientX + 2, event.clientY + 2);
    else
      this.contextmenu.showBackgroundMenu(event.clientX + 2, event.clientY + 2);
  }

  selectAll() {
    this.dirView.selectAll();
  }

  sort(value: string) {
    var type: SortType;
    switch (value) {
      case "name":
        type = SortType.Name;
        break;
      case "size":
        type = SortType.Size;
        break;
      case "creation":
        type = SortType.CreationDate;
        break;
    }
    this.dirView.sort(type);
  }

  changeIconsSize(value: string) {
    var size: FilesIconSize;
    switch (value) {
      case "small":
        size = FilesIconSize.Small;
        break;
      case "medium":
        size = FilesIconSize.Medium;
        break;
      case "large":
        size = FilesIconSize.Large;
        break;
    }
    this.mode.changeSize(size);
  }

  onSearch() {
    let keyword: string = this.searchInput.nativeElement.value;
    if (keyword.length > 0) this.dirView.search(keyword.toLowerCase());
    else {
      this.bgColor = "";
      this.dirView.exitSearchList();
    }
  }

  private clearSearchBox() {
    this.searchInput.nativeElement.value = "";
  }
}
