import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadManagerItemComponent } from './upload-manager-item.component';

describe('UploadManagerItemComponent', () => {
  let component: UploadManagerItemComponent;
  let fixture: ComponentFixture<UploadManagerItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadManagerItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadManagerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
