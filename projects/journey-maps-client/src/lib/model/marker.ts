import {Position} from 'geojson';
import {MarkerCategory} from './marker-category.enum';
import {InfoBlock} from './infoblock/info-block';

/**
 * Defines a marker (point) that will be displayed on the map.
 */
export interface Marker {
  /** ID identifying the marker */
  id: string;
  /**
   * The position of the marker. It's an array containing two numbers.
   * The first one is the longitude and the second one the latitude.
   */
  position: Position;
  /**
   * The category of the marker. The category controls which icon is displayed.
   * Use <code>CUSTOM</code> if you want to use a custom icon.
   */
  category: MarkerCategory | string;
  /**
   * URL of the custom marker icon. Only relevant for category <code>CUSTOM</code>.
   */
  icon?: string;
  /**
   * URL of the custom marker icon that is displayed when the marker is selected.
   * Only relevant for category <code>CUSTOM</code>.
   */
  iconSelected?: string;
  /** Title/Name of the marker. */
  title: string;
  /** Subtitle of the marker. */
  subtitle?: string;
  /**
   * List of info blocks that will be displayed in the overlay when the marker is selected.
   *
   * Alternatively, you can define an {@link JourneyMapsClientComponent#infoBoxTemplate}
   */
  infoBlocks?: InfoBlock[];
  /**
   * Url that will be opened if the marker is selected instead of the overlay.
   */
  markerUrl?: string;
  /**
   * If true of undefined the module will emit an event in output parameter selectedMarkerId:string when this marker is selected.
   * Default value is true.
   */
  triggerEvent?: boolean;
}
