import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  EventEmitter,
  Output
} from "@angular/core";

@Component({
  selector: "task-modal",
  templateUrl: "./task-modal.component.html",
  styleUrls: ["./task-modal.component.css"]
})
export class TaskModalComponent implements OnInit {
  @ViewChild("modalContainer") modalContainer: ElementRef;
  @Input("title") title: string;
  @Output() onClose = new EventEmitter();
  public x: string;
  public y: string;
  private lastX = 0;
  private lastY = 0;
  private mouseDown = false;
  constructor() {}

  ngOnInit() {
    this.winEvent();
  }

  close() {
    this.onClose.emit();
  }

  setMouseDown(event: MouseEvent, status: boolean) {
    if (event.which == 1) {
      if (status) {
        this.lastX = event.clientX;
        this.lastY = event.clientY;
      }
      this.mouseDown = status;
    }
  }

  setPosition(event: MouseEvent) {
    if (this.mouseDown) {
      let pos = this.getNewPosition(
        event.clientX,
        event.clientY,
        this.modalContainer.nativeElement.getBoundingClientRect()
      );
      this.x = pos[0] + "px";
      this.y = pos[1] + "px";

      this.lastX = event.clientX;
      this.lastY = event.clientY;
    }
  }

  getNewPosition(mouseX, mouseY, elmPos) {
    var values = [elmPos.left, elmPos.top];
    if (mouseX != this.lastX) values[0] = elmPos.left + (mouseX - this.lastX);
    if (mouseY != this.lastY) values[1] = elmPos.top + (mouseY - this.lastY);
    this.checkLimits(values);

    return values;
  }

  checkLimits(values) {
    var maxWidth =
      window.innerWidth -
      window.screenLeft -
      this.modalContainer.nativeElement.offsetWidth;
    var maxHeight =
      window.innerHeight -
      window.screenTop -
      this.modalContainer.nativeElement.offsetHeight;

    if (values[0] < 0) values[0] = 0;
    else if (values[0] > maxWidth) values[0] = maxWidth;
    if (values[1] < 0) values[1] = 0;
    else if (values[1] > maxHeight) values[1] = maxHeight;
  }

  winEvent() {
    var _this = this;
    window.addEventListener("mousemove", function(evt) {
      _this.setPosition(evt);
    });

    window.addEventListener("mouseup", function(evt) {
      _this.setMouseDown(evt, false);
    });
  }
}
