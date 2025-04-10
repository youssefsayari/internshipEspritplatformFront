import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Defense } from '../models/defense';

@Injectable({
  providedIn: 'root'
})
export class DefenseService {
  private baseUrl = 'http://localhost:8089/innoxpert/defense';

  constructor(private http: HttpClient) {}

  getAllDefenses(): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getAllDefenses`);
  }

  getDefenseById(idDefense: number): Observable<Defense> {
    return this.http.get<Defense>(`${this.baseUrl}/getDefenseById/${idDefense}`);
  }

  addDefense(studentId: number, defenseRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/defense/${studentId}/defenses`, defenseRequest);
  }
  

  updateDefense(defense: Defense): Observable<Defense> {
    return this.http.put<Defense>(`${this.baseUrl}/updateDefense`, defense);
  }

  deleteDefenseById(idDefense: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteDefenseById/${idDefense}`);
  }
  // New method to get defenses by tutor ID (dynamic)
  getDefensesByTutorId(tutorId: number): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getDefensesByTutor/${tutorId}`);
  }

  // Alternative method for static tutor ID = 2
  getDefensesForTutor2(): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getDefensesForTutor2`);
  }

}
