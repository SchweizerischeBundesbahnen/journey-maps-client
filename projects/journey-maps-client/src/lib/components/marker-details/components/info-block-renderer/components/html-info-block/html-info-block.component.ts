import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {HtmlInfoBlock} from '../../../../../../model/infoblock/html-info-block';

@Component({
  selector: 'rokas-html-info-block',
  templateUrl: './html-info-block.component.html',
  styleUrls: ['./html-info-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HtmlInfoBlockComponent implements OnInit {

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
