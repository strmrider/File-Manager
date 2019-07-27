import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDetailsContentComponent } from './file-details-content.component';

describe('FileDetailsContentComponent', () => {
  let component: FileDetailsContentComponent;
  let fixture: ComponentFixture<FileDetailsContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileDetailsContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileDetailsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
