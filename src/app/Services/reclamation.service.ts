import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reclamation } from '../models/reclamation';

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  markInProgress(id: number) {
    throw new Error('Method not implemented.');
  }

  private api = 'http://localhost:8089/innoxpert/api';

  constructor(private http: HttpClient) {}
  private getAuthHeaders(): { headers: any } {
    const token = localStorage.getItem('Token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.api}/reclamations`, this.getAuthHeaders());
  }


  create(userId: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.api}/reclamations/${userId}`, reclamation, this.getAuthHeaders());
  }


  update(id: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.api}/reclamations/${id}`, reclamation, this.getAuthHeaders());
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/reclamations/${id}`, this.getAuthHeaders());
  }


  respond(id: number, response: string): Observable<any> {
    return this.http.post(`${this.api}/reclamations/${id}/respond`, { response }, this.getAuthHeaders());
  }


  reject(id: number): Observable<any> {
    return this.http.post(`${this.api}/reclamations/${id}/reject`, {}, this.getAuthHeaders());
  }


  progress(id: number, userId: number): Observable<any> {
    return this.http.post(`${this.api}/reclamations/${id}/${userId}/progress`, {}, this.getAuthHeaders());
  }


  // ✅ Ajout nécessaire : rejet par l'admin d'une réclamation PENDING
  rejectByAdmin(id: number): Observable<any> {
    return this.http.post(`${this.api}/reclamations/${id}/reject`, {}, this.getAuthHeaders());
  }

}
