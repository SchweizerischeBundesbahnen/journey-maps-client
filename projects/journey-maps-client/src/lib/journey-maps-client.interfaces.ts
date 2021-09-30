import {StyleMode} from './model/style-mode.enum';
import {LngLatBoundsLike, LngLatLike} from 'mapbox-gl';

export interface Styles {
  /** Overwrite this value if you want to use a custom style id. */
  brightId?: string;
  /** Overwrite this value if you want to use a custom style id for the dark mode. */
  darkId?: string;
  /**
   * Overwrite this value if you want to use a style from a different source.
   * Actually you should not need this.
   */
  url?: string;
  /** Select the style mode between BRIGHT and DARK. */
  mode?: StyleMode;
}

export interface MovementControls {
  /** Whether the map should allow panning with one finger or not
   * If set to false, the users get a message-overlay if they try to pan with one finger.
   */
  allowOneFingerPan?: boolean;
  /** Whether the map can be zoomed by scrolling */
  allowScrollZoom?: boolean;
  /** Whether the map should show the level switch control or not. */
  showZoomControls?: boolean;
  /** Whether the map should show the zoom level control or not. */
  showLevelSwitch?: boolean;
}

export interface InitialSettings {
  /**
   * The initial center of the map. You should pass an array with two numbers.
   * The first one is the longitude and the second one the latitude.
   */
  mapCenter?: LngLatLike;
  /** The initial zoom level of the map. */
  zoomLevel?: number;
  /** The initial bounding box of the map. */
  boundingBox?: LngLatBoundsLike;
  /** The amount of padding in pixels to add to the given boundingBox. */
  boundingBoxPadding?: number;
  /** Wrap all markers in view if true. */
  zoomToMarkers?: boolean;
}

/**
 * **WARNING:** The map currently doesn't support more than one of these fields to be set at a time
 */
export interface JourneyMapsGeoJsonOption {
  /**
   * GeoJSON as returned by the <code>/journey</code> operation of Journey Maps.
   * All routes and transfers will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time
   */
  journey?: GeoJSON.FeatureCollection;

  /**
   * GeoJSON as returned by the <code>/transfer</code> operation of Journey Maps.
   * The transfer will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time
   */
  transfer?: GeoJSON.FeatureCollection;

  /**
   * An array of GeoJSON objects as returned by the <code>/route</code> and <code>/routes</code> operation of Journey Maps.
   * All routes will be displayed on the map.
   * Indoor routing is not (yet) supported.
   * Note: journey, transfer and routes cannot be displayed at the same time
   */
  routes?: GeoJSON.FeatureCollection[];
}

/**
 * fields that can be used both as @Input and @Output (2-Way-Binding)
 * When used as @Input, they can be used to select things on the map.
 * When used as @Output, they inform what has been selected on the map.
 */
export interface Selections {
  /**
   * Which of the markers contained in {@link JourneyMapsClientComponent#markers} is (to be) selected.
   *
   * When used as @Input, allowed values are either the ID of a marker to select or <code>undefined</code> to unselect.
   */
  selectedMarkerId?: string | undefined;
  /** Which (floor-)level is (to be) selected */
  selectedLevel?: number;
}
