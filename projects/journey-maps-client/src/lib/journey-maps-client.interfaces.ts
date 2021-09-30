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

export interface Controls {
  /** If the search bar - to filter markers - should be enabled or not. */
  showSearchBar?: boolean;
  /** Should show level switch control or not. */
  showZoomControls?: boolean;
  /** Should show zoom level control or not. */
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
