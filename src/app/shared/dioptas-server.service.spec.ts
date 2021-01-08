import { TestBed } from '@angular/core/testing';

import { DioptasServerService } from './dioptas-server.service';

describe('DioptasServerService', () => {
  let service: DioptasServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DioptasServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
