import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DragAndDropIconComponent } from './drag-and-drop-icon.component';

describe('DragAndDropIconComponent', () => {
  let component: DragAndDropIconComponent;
  let fixture: ComponentFixture<DragAndDropIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DragAndDropIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DragAndDropIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
