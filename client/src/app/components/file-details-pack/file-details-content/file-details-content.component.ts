import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { FileItem } from "src/app/shared/models/file-system/file items/file-item";
import { DirViewService } from "src/app/services/file-manager/dir-view/dir-view-service/dir-view.service";
import { TasksService } from "src/app/services/tasks/tasks-service/tasks.service";
import { FileType } from "src/app/shared/enums/file-type";
import { FileTypesHandler } from "src/app/shared/models/file-system/file items/file/file-types-handler";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "file-details-content",
  templateUrl: "./file-details-content.component.html",
  styleUrls: ["./file-details-content.component.css"]
})
export class FileDetailsContentComponent implements OnInit {
  @ViewChild("note") note: ElementRef;
  @ViewChild("editBtn") editBtn: ElementRef;
  public spellCheck: boolean = false;
  private noteReadOnly: boolean = true;
  public bindNote = true;
  public noteClassName: string = "note-normal";
  // saves the last selected file
  public lastSelected: FileItem = null;
  private _editBtnVisiblity: boolean = true;
  constructor(private dirView: DirViewService, private tasks: TasksService) {}

  ngOnInit() {
    var _this = this;
    window.addEventListener("mousedown", function(evt) {
      if (
        _this.note &&
        evt.target != _this.note.nativeElement &&
        evt.target != _this.editBtn.nativeElement &&
        !_this.noteReadOnly
      )
        _this.noteEditDisplay(false);
    });
  }

  get file() {
    let file = this.dirView.lastSelectedFile;
    if (file) return file;
    else return this.dirView.currentDir;
  }

  get fileSize() {
    let castedFile: any = this.file;
    return Utilities.fileSizeFormat(castedFile.size.size);
  }

  fileIcon() {
    return FileTypesHandler.getDetailsIcon(this.file.type);
  }

  typeDetailes(file: FileItem) {
    return FileTypesHandler.detailed(file);
  }

  isRoot(file: FileItem) {
    return file.type == FileType.Root;
  }

  getParent(file: FileItem) {
    if (this.isRoot(file)) return "";
    else {
      return file.parent.name;
    }
  }

  noteExist() {
    return this.file.note.length > 0;
  }

  getDescription() {
    var file = this.file;
    if (this.lastSelected) file = this.lastSelected;
    return file.note;
  }

  editBtnVisiblity() {
    return Utilities.visibility(this._editBtnVisiblity);
  }

  descriptionDisplay() {
    return Utilities.visibility(!this.isRoot(this.file));
  }

  textareaDisplay() {
    if (this.noteExist || this.lastSelected) return "block";
    else return "false";
  }

  noteEditDisplay(status = true) {
    if (status) {
      this.bindNote = false;
      this.noteReadOnly = false;
      this.noteClassName = "note-edit";
      this._editBtnVisiblity = false;
      this.spellCheck = true;
      this.lastSelected = this.file;
    } else {
      this.bindNote = true;
      this.noteReadOnly = true;
      this.noteClassName = "note-normal";
      this._editBtnVisiblity = true;
      this.saveNote(this.note.nativeElement.value);
      this.spellCheck = false;
      this.lastSelected = null;
    }
  }

  saveNote(note: string) {
    if (this.lastSelected && this.lastSelected.note != note) {
      this.tasks.updateNote(this.lastSelected, note, true);
    }
  }
}
