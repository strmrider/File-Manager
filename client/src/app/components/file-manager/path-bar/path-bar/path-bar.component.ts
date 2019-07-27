import { Component, OnInit } from "@angular/core";
import { PathBarService } from "src/app/services/file-manager/path-bar/path-bar.service";

@Component({
  selector: "path-bar",
  templateUrl: "./path-bar.component.html",
  styleUrls: ["./path-bar.component.css"]
})
export class PathBarComponent implements OnInit {
  constructor(public service: PathBarService) {}

  ngOnInit() {}
}
