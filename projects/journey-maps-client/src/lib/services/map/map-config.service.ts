import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MapConfigService {
  private _popup: boolean;
  private _allowOneFingerPan: boolean;
  private _enableSearchBar: boolean;
  private _showLevelSwitch: boolean;

  constructor() {
  }

  initializeConfigs(popup: boolean, allowOneFingerPan: boolean, enableSearchBar: boolean, showLevelSwitch: boolean): void {
    this._popup = popup;
    this._allowOneFingerPan = allowOneFingerPan;
    this._enableSearchBar = enableSearchBar;
    this._showLevelSwitch = showLevelSwitch;
  }

  get popup(): boolean {
    return this._popup;
  }

  // TODO cdi replace code that can take advantage of querying this service

  get allowOneFingerPan(): boolean {
    return this._allowOneFingerPan;
  }

  get enableSearchBar(): boolean {
    return this._enableSearchBar;
  }

  get showLevelSwitch(): boolean {
    return this._showLevelSwitch;
  }
}
