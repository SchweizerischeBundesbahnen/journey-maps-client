import {Component, Input, OnInit} from '@angular/core';
import {TextInfoBlock} from '../../../../model/infoblock/text-info-block';

@Component({
  selector: 'rokas-text-info-box',
  templateUrl: './text-info-box.component.html',
  styleUrls: ['./text-info-box.component.scss']
})
export class TextInfoBoxComponent implements OnInit {

  @Input() infoBlock: TextInfoBlock;

  constructor() {
  }

  ngOnInit(): void {
  }

  getClassName(): string {
    // CHECKME ses: Does empty string leads to a problem...?
    return this.infoBlock.cssClass ?? '';
  }
}
