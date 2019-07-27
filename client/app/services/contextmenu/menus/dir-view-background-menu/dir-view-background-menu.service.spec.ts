import { TestBed } from '@angular/core/testing';

import { DirViewBackgroundMenuService } from './dir-view-background-menu.service';

describe('DirViewBackgroundMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DirViewBackgroundMenuService = TestBed.get(DirViewBackgroundMenuService);
    expect(service).toBeTruthy();
  });
});
