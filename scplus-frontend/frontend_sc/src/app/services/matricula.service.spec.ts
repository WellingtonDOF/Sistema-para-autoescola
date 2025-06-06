import { TestBed } from '@angular/core/testing';

import { MatriculaService } from './matricula.service';

describe('MatriculaService', () => {
  let service: MatriculaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatriculaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
