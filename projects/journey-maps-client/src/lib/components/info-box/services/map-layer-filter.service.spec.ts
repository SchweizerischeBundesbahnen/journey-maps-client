import { TestBed } from '@angular/core/testing';

import { MapLayerFilterService } from './map-layer-filter.service';

describe('MapLayerFilterService', () => {
  let service: MapLayerFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapLayerFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
