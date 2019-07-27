import { Component, OnInit, Input } from "@angular/core";
import { MoveModalItemSelectionStyle } from "./move-modal-item-selection-style";
import { MoveModalService } from "src/app/services/modals/move-modal/move-modal.service";

@Component({
  selector: "move-modal-item",
  templateUrl: "./move-modal-item.component.html",
  styleUrls: ["./move-modal-item.component.css"]
})
export class MoveModalItemComponent implements OnInit {
  @Input() index: number;
  public style = new MoveModalItemSelectionStyle();
  private selectionSubscription;
  private disableSubscription;
  private undisableSubscription;
  private isSelected: boolean = false;
  private isDisabled: boolean = false;
  constructor(private moveModal: MoveModalService) {
    this.disableSubscription = this.moveModal.disable.subscribe(() => {
      this.undisable();
      if (this.moveModal.isIncluded(this.index)) {
        this.disable();
      }
    });
  }

  ngOnInit() {
    if (this.moveModal.isIncluded(this.index)) {
      this.disable();
    }
  }

  ngOnDestroy() {
    if (this.selectionSubscription) this.selectionSubscription.unsubscribe();
    if (this.disableSubscription) this.disableSubscription.unsubscribe();
    if (this.undisableSubscription) this.undisableSubscription.unsubscribe();
  }

  get dir() {
    return this.moveModal.dirList[this.index];
  }

  selectDir() {
    if (!this.isSelected && !this.isDisabled) {
      this.isSelected = true;
      this.moveModal.unselectRecent.emit();
      this.moveModal.lastIndex = this.index;
      this.setSubscription();
      this.style.selected();
    }
  }

  loadNewDir() {
    if (!this.dir.isEmpty && !this.isDisabled)
      this.moveModal.loadNewList(this.index);
  }

  onMouseover() {
    if (!this.isSelected && !this.isDisabled) this.style.over();
  }

  onMouseleave() {
    if (!this.isSelected && !this.isDisabled) this.style.normal();
  }

  private undisable() {
    this.isDisabled = false;
    this.style.normal();
  }

  private disable() {
    this.isDisabled = true;
    this.style.disabled();
    this.undisableSubscription = this.moveModal.undisable.subscribe(() =>
      this.undisable()
    );
  }

  private setSubscription() {
    this.selectionSubscription = this.moveModal.unselectRecent.subscribe(() => {
      this.style.normal();
      this.moveModal.lastIndex = -1;
      this.selectionSubscription.unsubscribe();
      this.isSelected = false;
    });
  }
}
