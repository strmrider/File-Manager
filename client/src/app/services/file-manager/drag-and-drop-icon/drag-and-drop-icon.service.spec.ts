import { TestBed } from '@angular/core/testing';

import { DragAndDropIconService } from './drag-and-drop-icon.service';

describe('DragAndDropIconService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DragAndDropIconService = TestBed.get(DragAndDropIconService);
    expect(service).toBeTruthy();
  });
});
