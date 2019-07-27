import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from "@angular/core";
import { NameModalService } from "src/app/services/modals/name-modal/name-modal.service";
import { Utilities } from "src/app/shared/utilities/utilities";
import { MessageModalService } from "src/app/services/modals/message-modal/message-modal.service";

@Component({
  selector: "name-modal",
  templateUrl: "./name-modal.component.html",
  styleUrls: ["./name-modal.component.css"]
})
export class NameModalComponent implements OnInit {
  public title: string = "";
  @Output() public closeModal = new EventEmitter();
  @ViewChild("nameInput") private inputBox: ElementRef;
  private _visibility = false;
  private focused = false;
  constructor(
    private service: NameModalService,
    private messageBox: MessageModalService
  ) {
    this.service.displayEmitter.subscribe(() => {
      this.focused = false;
      this.setTitle();
      this._visibility = true;
    });
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  visibility() {
    if (this._visibility) {
      if (!this.focused) {
        this.inputBox.nativeElement.select();
        this.inputBox.nativeElement.focus();
        this.inputBox.nativeElement.value = this.fileName();
      }
    }
    return Utilities.visibility(this._visibility);
  }

  setTitle() {
    if (this.service.type == 0) {
      this.title = "Rename";
    } else if (this.service.type == 1) this.title = "New folder";
  }

  fileName() {
    if (this.service.file) return this.service.file.name;
    else return "";
  }

  buttonTitle() {
    if (this.service.type == 0) return "Rename";
    else return "Create";
  }

  approveName() {
    let value = this.inputBox.nativeElement.value;
    if (value.length == 0) {
      this.messageBox.display("Error", "Please type a name");
    } else {
      this.service.execute(value);
      this.close();
    }
  }

  close() {
    this.inputBox.nativeElement.value = "";

    this._visibility = false;
  }

  onClick() {
    this.focused = true;
  }
}
