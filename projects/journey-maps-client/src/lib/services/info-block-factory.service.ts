import {Injectable} from '@angular/core';
import {TextInfoBlock} from '../model/infoblock/text-info-block';
import {InfoBlockType} from '../model/infoblock/info-block-type.enum';
import {ButtonInfoBlock} from '../model/infoblock/button-info-block';
import {AddressInfoBlock} from '../model/infoblock/address-info-block';

/**
 * Helper class to easily generate {@link InfoBlock}s.
 */
@Injectable({
  providedIn: 'root'
})
export class InfoBlockFactoryService {

  /**
   * Creates a text info block.
   *
   * @param title Title
   * @param content Content
   * @param cssClass Name of a CSS class that will be added to the element surrounding the info block
   */
  createTextInfoBlock(title: string, content: string, cssClass?: string): TextInfoBlock {
    return {
      type: InfoBlockType.TEXT,
      title,
      content,
      cssClass
    };
  }

  /**
   * Creates a button info block.
   * @param title Title
   * @param url URL that will be opened on button click
   */
  createButtonInfoBlock(title: string, url: string): ButtonInfoBlock {
    return {
      type: InfoBlockType.BUTTON,
      title,
      url
    };
  }

  /**
   * Creates an address info block
   */
  createAddressInfoBlock(
    title: string,
    street: string,
    zipCode: string,
    city: string,
    email: string,
    phoneNumber: string): AddressInfoBlock {
    return {
      type: InfoBlockType.ADDRESS,
      title,
      street,
      zipCode,
      city,
      email,
      phoneNumber
    };
  }
}
