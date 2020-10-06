import {Injectable} from '@angular/core';
import {TextInfoBlock} from '../model/infoblock/text-info-block';
import {InfoBlockType} from '../model/infoblock/info-block-type.enum';
import {ButtonInfoBlock} from '../model/infoblock/button-info-block';
import {HtmlInfoBlock} from '../model/infoblock/html-info-block';

@Injectable({
  providedIn: 'root'
})
export class InfoBlockFactoryService {

  createTextInfoBlock(title: string, content: string, cssClass?: string): TextInfoBlock {
    return {
      type: InfoBlockType.TEXT,
      title,
      content,
      cssClass
    };
  }

  createButtonInfoBlock(title: string, url: string): ButtonInfoBlock {
    return {
      type: InfoBlockType.BUTTON,
      title,
      url
    };
  }

  createHtmlInfoBlock(title: string, html: string): HtmlInfoBlock {
    return {
      type: InfoBlockType.HTML,
      title,
      html
    };
  }
}
