import { TestBed } from '@angular/core/testing';

import { ContextmenuService } from './contextmenu.service';

describe('ContextmenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContextmenuService = TestBed.get(ContextmenuService);
    expect(service).toBeTruthy();
  });
});
