import { TestBed, inject } from '@angular/core/testing';

import { AudioUtilService } from './audio-util.service';

describe('AudioUtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioUtilService]
    });
  });

  it('should be created', inject([AudioUtilService], (service: AudioUtilService) => {
    expect(service).toBeTruthy();
  }));
});
