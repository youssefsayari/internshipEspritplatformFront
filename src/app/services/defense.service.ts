import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Defense } from '../models/defense';


@Injectable({
  providedIn: 'root'
})
export class DefenseService {
  private baseUrl = 'http://localhost:8089/innoxpert/defense';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('Token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getAllDefenses(): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getAllDefenses`, this.getAuthHeaders());
  }


  getDefenseById(idDefense: number): Observable<Defense> {
    return this.http.get<Defense>(`${this.baseUrl}/getDefenseById/${idDefense}`, this.getAuthHeaders());
  }


  addDefense(studentId: number, defenseRequest: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/defense/${studentId}/defenses`, defenseRequest, this.getAuthHeaders());
  }


  updateDefense(defenseId: number, defenseRequest: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${defenseId}`, defenseRequest, this.getAuthHeaders());
  }

  generateEvaluationGrid(defenseId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/generate-evaluation-grid/${defenseId}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        'Accept': 'application/pdf'
      }),
      responseType: 'blob' as 'blob'
    });
  }



  downloadEvaluationGrid(defenseId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}/download-evaluation-grid/${defenseId}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        'Accept': 'application/pdf'
      }),
      observe: 'response',
      responseType: 'blob'
    });
  }




  deleteDefenseById(idDefense: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteDefenseById/${idDefense}`, this.getAuthHeaders());
  }

  getDefensesByTutorId(tutorId: number): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getDefensesByTutor/${tutorId}`, this.getAuthHeaders());
  }

  getDefensesForTutor2(): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getDefensesForTutor2`, this.getAuthHeaders());
  }
  getDefensesByStudentId(studentId: number): Observable<Defense[]> {
    return this.http.get<Defense[]>(`${this.baseUrl}/getDefensesByStudent/${studentId}`, this.getAuthHeaders());
  }
  getDefenseStats(): Observable<{ [key: string]: Defense[] }> {
    return this.http.get<{ [key: string]: Defense[] }>(`${this.baseUrl}/stats`, this.getAuthHeaders());
  }


}
