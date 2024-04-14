import { TestBed } from '@angular/core/testing';

import { UserFeedBackService } from './user-feed-back.service';

describe('UserFeedBackService', () => {
  let service: UserFeedBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFeedBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
