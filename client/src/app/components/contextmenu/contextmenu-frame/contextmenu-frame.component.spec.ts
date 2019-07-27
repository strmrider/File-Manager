import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextmenuFrameComponent } from './contextmenu-frame.component';

describe('ContextmenuFrameComponent', () => {
  let component: ContextmenuFrameComponent;
  let fixture: ComponentFixture<ContextmenuFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContextmenuFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextmenuFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
