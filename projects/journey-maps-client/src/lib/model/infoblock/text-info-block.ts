import {InfoBlock} from './info-block';

export interface TextInfoBlock extends InfoBlock {
  content: string;
  cssClass?: string;
}
