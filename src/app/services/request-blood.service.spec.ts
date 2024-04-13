import { TestBed } from '@angular/core/testing';

import { RequestBloodService } from './request-blood.service';

describe('RequestBloodService', () => {
  let service: RequestBloodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestBloodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
