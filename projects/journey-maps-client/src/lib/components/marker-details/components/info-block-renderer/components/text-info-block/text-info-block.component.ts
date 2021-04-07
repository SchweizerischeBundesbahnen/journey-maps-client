import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TextInfoBlock} from '../../../../../../model/infoblock/text-info-block';

@Component({
  selector: 'rokas-text-info-block',
  templateUrl: './text-info-block.component.html',
  styleUrls: ['./text-info-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextInfoBlockComponent {

  @Input() infoBlock: TextInfoBlock;

  constructor() {
  }

  getClassName(): string {
    // CHECKME ses: Does empty string leads to a problem...?
    return this.infoBlock.cssClass ?? '';
  }
}
