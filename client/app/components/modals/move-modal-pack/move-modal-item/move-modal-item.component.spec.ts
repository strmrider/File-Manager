import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveModalItemComponent } from './move-modal-item.component';

describe('MoveModalItemComponent', () => {
  let component: MoveModalItemComponent;
  let fixture: ComponentFixture<MoveModalItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveModalItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveModalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
