import {InfoBlock} from './info-block';

/**
 * This infoblock contains plain text.
 */
export interface TextInfoBlock extends InfoBlock {
  content: string;
  cssClass?: string;
}
