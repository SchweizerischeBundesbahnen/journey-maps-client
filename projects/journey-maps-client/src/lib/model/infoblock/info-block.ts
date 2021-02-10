import {InfoBlockType} from './info-block-type.enum';

/**
 * Basic interface defining an info block. Do not use this interface directly.
 * Use the matching child interface. If possible generate the info blocks with {@link InfoBlockFactoryService}
 *
 * In order to show an overlay when clicking on a marker, you need to either provide at least one InfoBlock
 * to {@link Marker#infoBlocks}, or else define a {@link JourneyMapsClientComponent#infoBoxTemplate}.
 */
export interface InfoBlock {
  title?: string;
  type: InfoBlockType;
}
