import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavTreeItemComponent } from './nav-tree-item.component';

describe('NavTreeItemComponent', () => {
  let component: NavTreeItemComponent;
  let fixture: ComponentFixture<NavTreeItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavTreeItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavTreeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
