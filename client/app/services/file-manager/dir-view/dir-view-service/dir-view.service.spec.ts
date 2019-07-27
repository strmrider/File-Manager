import { TestBed } from '@angular/core/testing';

import { DirViewService } from './dir-view.service';

describe('DirViewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DirViewService = TestBed.get(DirViewService);
    expect(service).toBeTruthy();
  });
});
