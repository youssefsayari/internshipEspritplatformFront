import { TestBed } from '@angular/core/testing';

import { TimeLineService } from './time-line.service';

describe('TimeLineService', () => {
  let service: TimeLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
