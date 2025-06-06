import { TestBed } from '@angular/core/testing';

import { PagamentoService } from './pagamento.service';

describe('PagamentoService', () => {
  let service: PagamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PagamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
