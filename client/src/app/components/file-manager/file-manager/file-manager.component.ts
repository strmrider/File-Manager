import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

@Component({
  selector: "file-manager",
  templateUrl: "./file-manager.component.html",
  styleUrls: ["./file-manager.component.css"]
})
export class FileManagerComponent implements OnInit {
  @ViewChild("mainContainer") container: ElementRef;
  private detailsSectionDisplay: boolean = false;
  private isReady = false;
  constructor() {}

  ngOnInit() {}

  dirViewFullSize() {
    if (!this.detailsSectionDisplay) return "opened";
    else return "closed";
  }

  toggleDetailsSection(event) {
    if (event != this.detailsSectionDisplay)
      this.detailsSectionDisplay = !this.detailsSectionDisplay;
  }
}
