import { TestBed } from '@angular/core/testing';

import { NavTreeService } from './nav-tree.service';

describe('NavTreeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavTreeService = TestBed.get(NavTreeService);
    expect(service).toBeTruthy();
  });
});
