import { TestBed } from '@angular/core/testing';

import { ParcelaService } from './parcela.service';

describe('ParcelaService', () => {
  let service: ParcelaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParcelaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
