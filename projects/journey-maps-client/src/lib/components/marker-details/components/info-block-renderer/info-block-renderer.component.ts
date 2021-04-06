import {Component, Input} from '@angular/core';
import {InfoBlock} from '../../../../model/infoblock/info-block';
import {InfoBlockType} from '../../../../model/infoblock/info-block-type.enum';

@Component({
  selector: 'rokas-info-block-renderer',
  templateUrl: './info-block-renderer.component.html',
  styleUrls: ['./info-block-renderer.component.scss']
})
export class InfoBlockRendererComponent {

  @Input() infoBlocks?: InfoBlock[];

  constructor() {
  }

  getInfoBlocks(): InfoBlock[] {
    return this.infoBlocks ?? [];
  }

  isTextInfoBlock(infoBlock: InfoBlock): boolean {
    return infoBlock.type === InfoBlockType.TEXT;
  }

  isButtonInfoBlock(infoBlock: InfoBlock): boolean {
    return infoBlock.type === InfoBlockType.BUTTON;
  }

  isHtmlInfoBlock(infoBlock: InfoBlock): boolean {
    return infoBlock.type === InfoBlockType.HTML;
  }

}
