import { TestBed, inject } from '@angular/core/testing';

import { RecorderService } from './recorder.service';

describe('RecorderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecorderService]
    });
  });

  it('should be created', inject([RecorderService], (service: RecorderService) => {
    expect(service).toBeTruthy();
  }));
});
