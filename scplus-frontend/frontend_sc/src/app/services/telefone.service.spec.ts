import { TestBed } from '@angular/core/testing';

import { TelefoneService } from './telefone.service';

describe('TelefoneService', () => {
  let service: TelefoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TelefoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
