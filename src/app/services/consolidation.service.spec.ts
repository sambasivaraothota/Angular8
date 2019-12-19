import { TestBed } from '@angular/core/testing';

import { ConsolidationService } from './consolidation.service';

describe('ConsolidationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsolidationService = TestBed.get(ConsolidationService);
    expect(service).toBeTruthy();
  });
});
