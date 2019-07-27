import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDetailsFrameComponent } from './file-details-frame.component';

describe('FileDetailsFrameComponent', () => {
  let component: FileDetailsFrameComponent;
  let fixture: ComponentFixture<FileDetailsFrameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDetailsFrameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDetailsFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
