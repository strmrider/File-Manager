import { TestBed } from '@angular/core/testing';

import { NameModalService } from './name-modal.service';

describe('NameModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NameModalService = TestBed.get(NameModalService);
    expect(service).toBeTruthy();
  });
});
