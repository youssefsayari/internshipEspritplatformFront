import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting';

const API_URL = 'http://localhost:8089/innoxpert/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }

  getAllSettings(): Observable<Setting[]> {
    return this.http.get<Setting[]>(API_URL);
  }

  updateSetting(key: string, value: string): Observable<any> {
    return this.http.put(`${API_URL}/${key}`, value, { responseType: 'text' });
  }
}
