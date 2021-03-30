import {MapLayerFilterService} from './map-layer-filter.service';

describe('MapLayerFilterService', () => {
  let service: MapLayerFilterService;

  beforeEach(() => {
    service = new MapLayerFilterService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set new floor - simple', () => {
    const oldFilter = ['==', 'floor', '0'];
    const level = 1;
    const newFilter = service.calculateLayerFilter(oldFilter, level);
    expect(newFilter).toEqual(['==', 'floor', 1]);
  });

  it('should set new floor - advanced', () => {
    const oldFilter = ['==', ['get', 'floor'], '0'];
    const level = -1;
    const newFilter = service.calculateLayerFilter(oldFilter, level);
    expect(newFilter).toEqual(['==', ['get', 'floor'], -1]);
  });

  it('should set new floor - expert', () => {
    const oldFilter = ['all', ['==', ['geometry-type'], 'Polygon'], ['==', 'floor', '0.0']];
    const level = 2.0;
    const newFilter = service.calculateLayerFilter(oldFilter, level);
    expect(newFilter).toEqual(['all', ['==', ['geometry-type'], 'Polygon'], ['==', 'floor', 2]]);
  });

  it('should set new level - case-filter', () => {
    const oldFilter = ['all', ['==', ['case', ['has', 'level'], ['get', 'level'], 0], 0], ['==', ['geometry-type'], 'Polygon']];
    const level = 2;
    const newFilter = service.calculateLayerFilter(oldFilter, level);
    expect(newFilter).toEqual(['all', ['==', ['case', ['has', 'level'], ['get', 'level'], 0], 2], ['==', ['geometry-type'], 'Polygon']]);
  });
});
