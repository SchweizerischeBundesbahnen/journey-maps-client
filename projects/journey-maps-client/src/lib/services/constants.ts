export class Constants {
  static readonly CLUSTER_RADIUS = 50;
  static readonly MARKER_BOUNDS_PADDING = 40;

  static readonly MARKER_SOURCE = 'rokas-marker-source';
  static readonly ROUTE_SOURCE = 'rokas-route-source';
  static readonly WALK_SOURCE = 'rokas-walk-source';

  static readonly SOURCES = [
    Constants.MARKER_SOURCE,
    Constants.ROUTE_SOURCE,
    Constants.WALK_SOURCE,
  ];

  static readonly MARKER_AND_CLUSTER_LAYERS = [
    'rokas-marker-circle',
    'rokas-marker-cluster',
    'rokas-marker-cluster-text',
    'rokas-marker',
    'rokas-marker-selected'
  ];

  static readonly MARKER_LAYERS = [
    'rokas-marker-circle',
    'rokas-marker',
    'rokas-marker-selected'
  ];

  static readonly CLUSTER_LAYER = 'rokas-marker-cluster';
  static readonly MARKER_LAYER = 'rokas-marker';
  static readonly MARKER_LAYER_SELECTED = 'rokas-marker-selected';

}
