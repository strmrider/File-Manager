import { Component, OnInit } from "@angular/core";
import { MessageModalService } from "src/app/services/modals/message-modal/message-modal.service";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "message-modal",
  templateUrl: "./message-modal.component.html",
  styleUrls: ["./message-modal.component.css"]
})
export class MessageModalComponent implements OnInit {
  private _visibility: boolean = false;
  public title: string = "";
  public message: string = "";
  constructor(private service: MessageModalService) {
    this.service.displatEmitter.subscribe(data => {
      this._visibility = true;
      this.title = data.title;
      this.message = data.message;
    });
  }

  ngOnInit() {}

  get visibility() {
    return Utilities.visibility(this._visibility);
  }

  close() {
    this._visibility = false;
    this.title = "";
    this.message = "";
  }
}
