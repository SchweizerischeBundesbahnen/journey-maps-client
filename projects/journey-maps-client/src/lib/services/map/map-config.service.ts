import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MapConfigService {
  private _popup: boolean;
  private _allowOneFingerPan: boolean;
  private _showLevelSwitch: boolean;

  constructor() {
  }

  updateConfigs(popup: boolean, allowOneFingerPan: boolean, showLevelSwitch: boolean): void {
    this._popup = popup;
    this._allowOneFingerPan = allowOneFingerPan;
    this._showLevelSwitch = showLevelSwitch;
  }

  get popup(): boolean {
    return this._popup;
  }

  get allowOneFingerPan(): boolean {
    return this._allowOneFingerPan;
  }

  get showLevelSwitch(): boolean {
    return this._showLevelSwitch;
  }
}
