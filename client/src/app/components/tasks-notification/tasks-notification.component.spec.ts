import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksNotificationComponent } from './tasks-notification.component';

describe('TasksNotificationComponent', () => {
  let component: TasksNotificationComponent;
  let fixture: ComponentFixture<TasksNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasksNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasksNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
