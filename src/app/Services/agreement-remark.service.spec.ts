import { TestBed } from '@angular/core/testing';

import { AgreementRemarkService } from './agreement-remark.service';

describe('AgreementRemarkService', () => {
  let service: AgreementRemarkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgreementRemarkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
