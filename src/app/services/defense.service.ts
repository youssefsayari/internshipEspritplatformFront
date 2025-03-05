import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Defense } from '../models/defense';

@Injectable({
  providedIn: 'root'
})
export class DefenseService {
  private baseUrl = 'http://localhost:8090/innoxpert/defense';

  constructor(private http: HttpClient) {}

  getAllDefenses(): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getAllDefenses`);
  }

  getDefenseById(idDefense: number): Observable<Defense> {
    return this.http.get<Defense>(`${this.baseUrl}/getDefenseById/${idDefense}`);
  }

  addDefense(defense: Defense): Observable<Defense> {
    return this.http.post<Defense>(`${this.baseUrl}/addDefense`, defense);
  }

  updateDefense(defense: Defense): Observable<Defense> {
    return this.http.put<Defense>(`${this.baseUrl}/updateDefense`, defense);
  }

  deleteDefenseById(idDefense: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteDefenseById/${idDefense}`);
  }
}
