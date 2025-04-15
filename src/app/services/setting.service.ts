import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Setting } from '../models/setting';

const API_URL = 'http://localhost:8089/innoxpert/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllSettings(): Observable<Setting[]> {
    return this.http.get<Setting[]>(API_URL, {
      headers: this.getAuthHeaders()
    });
  }

  updateSetting(key: string, value: string): Observable<any> {
    return this.http.put(`${API_URL}/${key}`, value, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}
