import { TestBed } from '@angular/core/testing';

import { LocalSystemTasksService } from './local-system-tasks.service';

describe('LocalSystemTasksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalSystemTasksService = TestBed.get(LocalSystemTasksService);
    expect(service).toBeTruthy();
  });
});
