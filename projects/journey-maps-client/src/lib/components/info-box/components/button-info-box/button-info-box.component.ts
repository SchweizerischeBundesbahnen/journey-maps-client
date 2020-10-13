import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ButtonInfoBlock} from '../../../../model/infoblock/button-info-block';

@Component({
  selector: 'rokas-button-info-box',
  templateUrl: './button-info-box.component.html',
  styleUrls: ['./button-info-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonInfoBoxComponent implements OnInit {

  @Input() infoBlock: ButtonInfoBlock;


  constructor() {
  }

  ngOnInit(): void {
  }

  onButtonClicked(): void {
    window.open(this.infoBlock.url, '_blank');
  }
}
