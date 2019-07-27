import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { SystemService } from "src/app/services/system/system.service";
import { ContextmenuService } from "src/app/services/contextmenu/contextmenu-service/contextmenu.service";
import { File } from "src/app/shared/models/file-system/file items/file/file";
import { FileType } from "src/app/shared/enums/file-type";
import { Utilities } from "src/app/shared/utilities/utilities";
import { FilePreviewService } from "src/app/services/file-preview/file-preview.service";
import { Shortcut } from "src/app/shared/models/file-system/file items/shortcut";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "file-preview",
  templateUrl: "./file-preview.component.html",
  styleUrls: ["./file-preview.component.css"]
})
export class FilePreviewComponent implements OnInit {
  @ViewChild("frame") mainframe: ElementRef;
  @ViewChild("content") contentContainer: ElementRef;
  public src = "";
  public noPreview = false;
  private visibility = false;
  private file: File;
  private textFile: string = "";
  private fileRemovalInterval;
  constructor(
    private system: SystemService,
    private service: FilePreviewService,
    private contextmenu: ContextmenuService,
    private http: HttpClient
  ) {
    this.service.displayEmitter.subscribe(file => this.display(file));
  }

  ngOnInit() {}

  ngOnDestory() {
    clearInterval(this.fileRemovalInterval);
  }

  display(file: File) {
    this.file = file;
    this.handleShortcut();
    this.visibility = true;

    if (this.file.isMedia) this.setMedia();
    else if (this.isTextFile()) this.setText();
    else this.noPreview = true;

    this.fileRemovalInterval = setInterval(() => {
      if (this.file.status.deleted) this.close();
    });
  }

  get onDisplay() {
    return this.visibility;
  }

  filename() {
    if (this.file) return this.file.name;
  }

  isTextFile() {
    if (this.file) return this.file.type == FileType.Text;
    else return false;
  }

  getVisibility() {
    return Utilities.visibility(this.visibility);
  }

  isImage() {
    if (this.file) return this.file.type == FileType.Image;
    else return false;
  }

  isVideo() {
    if (this.file) return this.file.type == FileType.Video;
    else return false;
  }

  isAudio() {
    if (this.file) return this.file.type == FileType.Audio;
    else return false;
  }

  close() {
    this.visibility = false;
    if (this.file.isMedia) this.src = "";
    else this.textFile = "";
    this.noPreview = false;
    clearInterval(this.fileRemovalInterval);
  }

  bgClose(event: MouseEvent) {
    event.stopPropagation();
    var an: any = event.target;
    if (!an.classList.contains("menu-button")) this.contextmenu.close();
    if (event.target == this.mainframe.nativeElement) this.close();
  }

  openMenu(event: MouseEvent) {
    this.contextmenu.showFilePreviewMenu(
      event.clientX,
      event.clientY,
      !this.file.status.isStar
    );
  }

  private handleShortcut() {
    if (this.file.isShortcut) {
      let tempFile: any = this.file;
      let shortcut: Shortcut = tempFile;
      tempFile = shortcut.reference;
      this.file = tempFile;
    }
  }

  private setMedia() {
    this.src = this.system.config.fileStorageUrl + this.file.filename;
  }

  private setText() {
    this.http
      .get(this.system.config.fileStorageUrl + this.file.filename, {
        responseType: "text"
      })
      .subscribe(text => {
        this.textFile = text;
      });
  }
}
