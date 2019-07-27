import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDetailsItemComponent } from './file-details-item.component';

describe('FileDetailsItemComponent', () => {
  let component: FileDetailsItemComponent;
  let fixture: ComponentFixture<FileDetailsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDetailsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDetailsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
