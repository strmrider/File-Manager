import { TestBed } from '@angular/core/testing';

import { DirViewDisplayModeService } from './dir-view-display-mode.service';

describe('DirViewDisplayModeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DirViewDisplayModeService = TestBed.get(DirViewDisplayModeService);
    expect(service).toBeTruthy();
  });
});
