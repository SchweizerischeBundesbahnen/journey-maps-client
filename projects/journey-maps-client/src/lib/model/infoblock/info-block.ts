import {InfoBlockType} from './info-block-type.enum';

/**
 * Basic interface defining an info block. Do not use this interface directly.
 * Use the matching child interface. If possible generate the info blocks with {@link InfoBlockFactoryService}
 */
export interface InfoBlock {
  title?: string;
  type: InfoBlockType;
}
