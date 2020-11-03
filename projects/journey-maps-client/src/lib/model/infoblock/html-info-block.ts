import {InfoBlock} from './info-block';

/**
 * This infoblock contains a custom HTML blocks.
 */
export interface HtmlInfoBlock extends InfoBlock {
  html: string;
}
