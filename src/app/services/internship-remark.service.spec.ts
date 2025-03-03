import { TestBed } from '@angular/core/testing';

import { InternshipRemarkService } from './internship-remark.service';

describe('InternshipRemarkService', () => {
  let service: InternshipRemarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternshipRemarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
