import {browser, by, element} from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getText(): Promise<string> {
    return element(by.css('rokas-journey-maps-client')).getText() as Promise<string>;
  }
}
