import { TestBed } from '@angular/core/testing';

import { MoveModalService } from './move-modal.service';

describe('MoveModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoveModalService = TestBed.get(MoveModalService);
    expect(service).toBeTruthy();
  });
});
