import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathBarItemComponent } from './path-bar-item.component';

describe('PathBarItemComponent', () => {
  let component: PathBarItemComponent;
  let fixture: ComponentFixture<PathBarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathBarItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathBarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
