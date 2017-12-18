import { TestBed, inject } from '@angular/core/testing';

import { WebEmpathService } from './web-empath.service';

describe('WebEmpathService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebEmpathService]
    });
  });

  it('should be created', inject([WebEmpathService], (service: WebEmpathService) => {
    expect(service).toBeTruthy();
  }));
});
