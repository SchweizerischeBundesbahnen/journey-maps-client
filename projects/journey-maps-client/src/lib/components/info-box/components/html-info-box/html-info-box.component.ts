import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {HtmlInfoBlock} from '../../../../model/infoblock/html-info-block';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'rokas-html-info-box',
  templateUrl: './html-info-box.component.html',
  styleUrls: ['./html-info-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HtmlInfoBoxComponent implements OnInit {

  private _infoBlock: HtmlInfoBlock;
  html: any;

  constructor(private sanitized: DomSanitizer) {
  }

  ngOnInit(): void {
  }


  get infoBlock(): HtmlInfoBlock {
    return this._infoBlock;
  }

  @Input() set infoBlock(value: HtmlInfoBlock) {
    this._infoBlock = value;
    this.html = this.sanitized.bypassSecurityTrustHtml(value.html);
  }
}
