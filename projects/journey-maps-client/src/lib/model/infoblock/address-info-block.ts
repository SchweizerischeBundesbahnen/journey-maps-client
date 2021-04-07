import {InfoBlock} from './info-block';

/**
 * This info block contains address data.
 */
export interface AddressInfoBlock extends InfoBlock {

  street: string;
  zipCode: string;
  city: string;
  phoneNumber: string;
  email: string;

}
