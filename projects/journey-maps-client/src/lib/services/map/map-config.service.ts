import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MapConfigService {
  private _popup: boolean;

  updateConfigs(popup: boolean): void {
    this._popup = popup;
  }

  get popup(): boolean {
    return this._popup;
  }
}
