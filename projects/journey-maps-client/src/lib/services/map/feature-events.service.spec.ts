import {TestBed} from '@angular/core/testing';

import {FeatureEventsService} from './feature-events.service';

describe('FeatureEventsService', () => {
  let service: FeatureEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
