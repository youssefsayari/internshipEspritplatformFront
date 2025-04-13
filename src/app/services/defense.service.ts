import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  
  updateDefense(defenseId: number, defenseRequest: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/update/${defenseId}`,
      defenseRequest
    );
  }
  

  

  deleteDefenseById(idDefense: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteDefenseById/${idDefense}`);
  }
  // New method to get defenses by tutor ID (dynamic)
  getDefensesByTutorId(tutorId: number): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getDefensesByTutor/${tutorId}`);
  }

  getDefensesForTutor2(): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getDefensesForTutor2`);
  }
getDefensesByStudentId(studentId: number): Observable<Defense[]> {
  return this.http.get<Defense[]>(`${this.baseUrl}/getDefensesByStudent/${studentId}`);
}
getDefenseStats(): Observable<{ [key: string]: Defense[] }> {
  return this.http.get<{ [key: string]: Defense[] }>(`${this.baseUrl}/stats`);
}


}