import { TestBed } from '@angular/core/testing';

import { PathBarService } from './path-bar.service';

describe('PathBarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PathBarService = TestBed.get(PathBarService);
    expect(service).toBeTruthy();
  });
});
