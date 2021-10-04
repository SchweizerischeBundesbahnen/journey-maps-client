import {StyleMode} from './model/style-mode.enum';
import {LngLatBoundsLike, LngLatLike} from 'mapbox-gl';
import {Marker} from './model/marker';

export interface StyleOptions {
  /** Overwrite this value if you want to use a custom style id. */
  brightId?: string;
  /** Overwrite this value if you want to use a custom style id for the dark mode. */
  darkId?: string;
  /** Select the style mode between BRIGHT and DARK. */
  mode?: StyleMode;
}

export interface ControlOptions {
  /** Whether the map should allow panning with one finger or not
   * If set to false, the users get a message-overlay if they try to pan with one finger.
   */
  allowOneFingerPan?: boolean;
  /** Whether the map can be zoomed by scrolling */
  allowScrollZoom?: boolean;
  /** Whether the map should show the zoom level control or not. */
  showLevelSwitch?: boolean;
  /** Whether the map should show the level switch control or not. */
  showZoomControls?: boolean;
}

export interface ViewportOptions {
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
}

/**
 * **WARNING:** The map currently doesn't support more than one of these fields to be set at a time
 */
export interface JourneyMapsRoutingOptions {
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

export interface MarkerOptions {
  /** Whether the search bar - to filter markers - should be shown or not. */
  enableSearchBar?: boolean;
  /** The list of markers (points) that will be displayed on the map. */
  markers?: Marker[];
  /** Open a popup - instead of the teaser - when selecting a marker. */
  popup?: boolean;
  /** Wrap all markers in view if true. */
  zoomToMarkers?: boolean;
}

export interface ZoomLevels {
  /** The minimal zoom level of the map. */
  minZoom: number;
  /** The maximal zoom level of the map. */
  maxZoom: number;
  /** The current zoom level of the map. */
  currentZoom: number;
}