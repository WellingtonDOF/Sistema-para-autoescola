import { TestBed } from '@angular/core/testing';

import { InstrutorService } from './instrutor.service';

describe('InstrutorService', () => {
  let service: InstrutorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstrutorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
