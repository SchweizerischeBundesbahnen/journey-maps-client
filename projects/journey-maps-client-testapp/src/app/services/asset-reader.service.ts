import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AssetReaderService {

  constructor(private http: HttpClient) {
  }

  loadAssetAsString(filename): Observable<string> {
    return this.http.get(`assets/${filename}`, {responseType: 'text'});
  }
}
