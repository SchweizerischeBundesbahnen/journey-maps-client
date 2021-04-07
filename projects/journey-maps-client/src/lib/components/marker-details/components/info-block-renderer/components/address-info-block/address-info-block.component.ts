import {Component, Input} from '@angular/core';
import {AddressInfoBlock} from '../../../../../../model/infoblock/address-info-block';

@Component({
  selector: 'rokas-address-info-block',
  templateUrl: './address-info-block.component.html',
  styleUrls: ['./address-info-block.component.scss']
})
export class AddressInfoBlockComponent {

  @Input() infoBlock: AddressInfoBlock;

  constructor() {
  }

}
