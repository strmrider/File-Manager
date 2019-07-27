import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter
} from "@angular/core";
import { MoveModalService } from "src/app/services/modals/move-modal/move-modal.service";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "move-modal",
  templateUrl: "./move-modal.component.html",
  styleUrls: ["./move-modal.component.css"]
})
export class MoveModalComponent implements OnInit {
  @ViewChild("newDirInput") newDirInput: ElementRef;
  @ViewChild("container") container: ElementRef;
  @Output() setTitle = new EventEmitter();
  public title: string = "Move to";
  private _visibility: boolean = false;
  private newDirVisibility: boolean = false;
  private navBtnsVisibility: boolean = true;
  constructor(public service: MoveModalService) {
    this.service.clearMarksEmitter.subscribe(() => this.unselectRecent());
    this.service.visibilityEmitter.subscribe(() => {
      this._visibility = true;
      this.displayNewFolderDiv(false);
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  displayNewFolderDiv(status: boolean) {
    this.newDirVisibility = status;
    this.navBtnsVisibility = !status;
  }

  get visibility() {
    return Utilities.visibility(this._visibility);
  }

  get newDirDisplay() {
    return Utilities.visibility(this.newDirVisibility);
  }

  get navBtnsDisplay() {
    return Utilities.visibility(this.navBtnsVisibility);
  }

  createNewDir() {
    let name = this.newDirInput.nativeElement.value;
    if (name.length > 0) {
      this.service.newDir(this.newDirInput.nativeElement.value);
      this.displayNewFolderDiv(false);
    } else alert("Please type a name");
  }

  move() {
    if (this.service.lastIndex >= 0) {
      this.service.move();
      this.close();
    } else alert("Select a directory");
  }

  close() {
    this.unselectRecent();
    this._visibility = false;
  }

  unselectRecent() {
    this.service.unselectRecent.emit();
    //this.service.undisable.emit();
  }

  onClick(event: MouseEvent) {
    if (event.target == this.container.nativeElement) this.unselectRecent();
  }
}
