import { TestBed } from '@angular/core/testing';

import { FileItemMenuService } from './file-item-menu.service';

describe('FileItemMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileItemMenuService = TestBed.get(FileItemMenuService);
    expect(service).toBeTruthy();
  });
});
