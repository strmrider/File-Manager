import { TestBed } from '@angular/core/testing';

import { TrashItemMenuService } from './trash-item-menu.service';

describe('TrashItemMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrashItemMenuService = TestBed.get(TrashItemMenuService);
    expect(service).toBeTruthy();
  });
});
