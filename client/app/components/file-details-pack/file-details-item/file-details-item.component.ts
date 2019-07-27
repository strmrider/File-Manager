import { Component, OnInit, Input } from "@angular/core";
import { Directory } from "src/app/shared/models/file-system/file items/directory/directory";
import { DirViewService } from "src/app/services/file-manager/dir-view/dir-view-service/dir-view.service";
import { FileType } from "src/app/shared/enums/file-type";

@Component({
  selector: "file-details-item",
  templateUrl: "./file-details-item.component.html",
  styleUrls: ["./file-details-item.component.css"]
})
export class FileDetailsItemComponent implements OnInit {
  @Input() uniqueClass: string = "";
  @Input() caption: string;
  @Input() value: string;
  @Input() title: string;
  @Input() target: Directory;

  public linkClass: string = "";
  constructor(private dirView: DirViewService) {}

  ngOnInit() {
    if (this.target) this.linkClass = "link";
  }

  valueClick() {
    if (this.target) {
      let dirViewTarget;
      if (this.target.isDirectory || this.target.type == FileType.Root)
        dirViewTarget = this.target;
      else dirViewTarget = this.target.parent;
      this.dirView.loadNewDir(dirViewTarget);
    }
  }
}
