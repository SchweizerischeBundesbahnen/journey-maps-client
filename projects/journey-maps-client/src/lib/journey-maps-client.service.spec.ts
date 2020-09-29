import {TestBed} from '@angular/core/testing';

import {JourneyMapsClientService} from './journey-maps-client.service';

describe('JourneyMapsClientService', () => {
  let service: JourneyMapsClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JourneyMapsClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
