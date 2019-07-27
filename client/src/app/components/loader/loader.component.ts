import { Component, OnInit } from "@angular/core";
import { SystemService } from "src/app/services/system/system.service";
import { Utilities } from "src/app/shared/utilities/utilities";

@Component({
  selector: "loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.css"]
})
export class LoaderComponent implements OnInit {
  private _visibility: boolean = false;
  constructor(private system: SystemService) {
    this.system.loader.subscribe(status => {
      this._visibility = status;
    });
  }

  ngOnInit() {}

  get visibility() {
    return Utilities.visibility(this._visibility);
  }
}
