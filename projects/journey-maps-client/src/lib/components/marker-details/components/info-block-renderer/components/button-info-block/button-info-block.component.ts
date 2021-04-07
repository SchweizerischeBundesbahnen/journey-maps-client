import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ButtonInfoBlock} from '../../../../../../model/infoblock/button-info-block';

@Component({
  selector: 'rokas-button-info-block',
  templateUrl: './button-info-block.component.html',
  styleUrls: ['./button-info-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonInfoBlockComponent {

  @Input() infoBlock: ButtonInfoBlock;


  constructor() {
  }

  onButtonClicked(): void {
    window.open(this.infoBlock.url, '_blank');
  }
}
