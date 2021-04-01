import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ButtonInfoBlock} from '../../../../../../model/infoblock/button-info-block';

@Component({
  selector: 'rokas-button-info-block',
  templateUrl: './button-info-block.component.html',
  styleUrls: ['./button-info-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonInfoBlockComponent implements OnInit {

  @Input() infoBlock: ButtonInfoBlock;


  constructor() {
  }

  ngOnInit(): void {
  }

  onButtonClicked(): void {
    window.open(this.infoBlock.url, '_blank');
  }
}
