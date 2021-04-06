export class Constants {
  static readonly CLUSTER_RADIUS = 50;
  static readonly MARKER_BOUNDS_PADDING = 40;

  static readonly MARKER_SOURCE = 'rokas-marker-source';
  static readonly ROUTE_SOURCE = 'rokas-route-source';
  static readonly WALK_SOURCE = 'rokas-walk-source';

  static readonly CLUSTER_LAYER = 'rokas-marker-cluster';
  static readonly MARKER_LAYER = 'sbb-marker';
  static readonly MARKER_LAYER_SELECTED = 'sbb-marker-selected';

  static readonly SOURCES = [
    Constants.MARKER_SOURCE,
    Constants.ROUTE_SOURCE,
    Constants.WALK_SOURCE,
  ];

  static readonly MARKER_AND_CLUSTER_LAYERS = [
    'rokas-marker-cluster',
    'rokas-marker-cluster-text',
    Constants.MARKER_LAYER,
    Constants.MARKER_LAYER_SELECTED
  ];

  static readonly MARKER_LAYERS = [
    'rokas-marker-circle',
    Constants.MARKER_LAYER,
    Constants.MARKER_LAYER_SELECTED
  ];
}
