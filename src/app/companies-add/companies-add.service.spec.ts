import { TestBed } from '@angular/core/testing';

import { CompaniesAddService } from './companies-add.service';

describe('CompaniesAddService', () => {
  let service: CompaniesAddService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompaniesAddService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
