import { TestBed } from '@angular/core/testing';

import { UpcomingEventsService } from './upcoming-events.service';

describe('UpcomingEventsService', () => {
  let service: UpcomingEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpcomingEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
