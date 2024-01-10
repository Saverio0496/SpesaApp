import { TestBed } from '@angular/core/testing';

import { NegozioService } from './negozio.service';

describe('NegozioService', () => {
  let service: NegozioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NegozioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
