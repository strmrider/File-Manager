import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragSelectionBoxComponent } from './drag-selection-box.component';

describe('DragSelectionBoxComponent', () => {
  let component: DragSelectionBoxComponent;
  let fixture: ComponentFixture<DragSelectionBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragSelectionBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragSelectionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
