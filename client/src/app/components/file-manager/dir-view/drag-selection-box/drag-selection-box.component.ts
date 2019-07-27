import { Component, OnInit, ViewChild, ElementRef, Input } from "@angular/core";

@Component({
  selector: "drag-selection-box",
  templateUrl: "./drag-selection-box.component.html",
  styleUrls: ["./drag-selection-box.component.css"]
})
export class DragSelectionBoxComponent implements OnInit {
  @ViewChild("dragSelectionBox") boxElement: ElementRef;
  @Input() scrollContainer: Function;
  @Input() scrollbarWidth: Function;
  @Input() containerSize: any;
  private dragStarted = false;
  private mouseDown = false;
  private afterDrag = false;
  private box: HTMLElement;

  private orig_x; // original x when mouse was initially clicked
  private orig_y; // original y when mouse was initially clicked
  private theoreticTop;
  private theoreticLeft;

  private mouseY;
  private interval;
  private changes;
  constructor() {}

  ngOnInit() {
    this.box = this.boxElement.nativeElement;
  }

  setMouseDown() {
    this.mouseDown = true;
  }

  get isDragged() {
    return this.dragStarted;
  }

  get isAfterDrag() {
    return this.afterDrag;
  }

  getCursorPosition(event) {
    var evt = event || window.event;
    if (evt) {
      return [
        evt.clientX + (this.box.scrollLeft || 0) - (this.box.clientLeft || 0),
        evt.clientY + (this.box.scrollTop || 0) - (this.box.clientTop || 0)
      ];
    }

    return null;
  }

  isCovered(elemPos) {
    var boxPos = this.box.getBoundingClientRect();
    let top = boxPos.top;
    let bottom = boxPos.bottom;

    var y = top > elemPos.bottom || bottom < elemPos.top;
    var x = boxPos.left > elemPos.right || boxPos.right < elemPos.left;

    return !(x || y);
  }

  /******************
   * Dragging methods
   ******************/

  handleDrag(event) {
    if (this.dragStarted) this.drag(event);
    else if (this.mouseDown) {
      this.startDrag(event);
    }
  }

  private startDrag(event) {
    var mxy = this.getCursorPosition(event);
    this.dragStarted = true;

    this.orig_x = mxy[0];
    this.orig_y = mxy[1];
    this.box.style.width = this.box.style.height = "0px";
    this.box.style.left = mxy[0] + "px";
    this.box.style.top = mxy[1] + "px";
    this.box.style.display = "block";

    this.changes = this.orig_y;
    this.theoreticTop = this.orig_y;
    this.drag(event);
    this.mouseY = event.clientY;
    var _this = this;
    this.interval = setInterval(function() {
      _this.scrollCheck();
    });
  }

  endDrag(event) {
    if (this.box) this.box.style.display = "none";
    this.dragStarted = false;
    this.afterDrag = true;
    this.mouseDown = false;
    clearInterval(this.interval);
  }

  private drag(event) {
    this.mouseY = event.clientY;
    var mxy = this.getCursorPosition(event);
    var w = Math.abs(mxy[0] - this.orig_x);
    var h = Math.abs(mxy[1] - this.changes);

    this.box.style.width = w + "px";
    this.box.style.height = h + "px";

    // sets positions of x, y after changing the size of the box
    this.box.style.left =
      mxy[0] <= this.orig_x ? this.orig_x - w + "px" : this.orig_x;
    this.box.style.top =
      mxy[1] <= this.orig_y ? this.changes - h + "px" : this.changes;
    this.fixToBoundaries(null);
  }

  private scrollCheck() {
    if (
      this.mouseY >= this.containerSize.bottom ||
      this.mouseY <= this.containerSize.top
    )
      this.scroll();
  }

  private scroll() {
    var change = this.scrollContainer(this.mouseY);
    if (change) {
      this.changes += change;
      this.theoreticTop = parseInt(this.box.style.top) + change;
      this.box.style.top = parseInt(this.box.style.top) + change + "px";
    }
  }

  private fixToBoundaries(event) {
    var containerDim = this.containerSize;
    var boxDim = this.box.getBoundingClientRect();
    var scrollbarwidth = this.scrollbarWidth();

    if (boxDim.left < containerDim.left) {
      this.box.style.left = containerDim.left + "px";
      this.box.style.width =
        boxDim.width - (containerDim.left - boxDim.left) + "px";
    } else if (boxDim.right > containerDim.right - scrollbarwidth) {
      this.box.style.width =
        boxDim.width -
        (boxDim.right - containerDim.right) -
        scrollbarwidth +
        "px";
    }
  }
}
