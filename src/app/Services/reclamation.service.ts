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

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(`${this.api}/reclamations`);
  }

  create(userId: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.post<Reclamation>(`${this.api}/reclamations/${userId}`, reclamation);
  }

  update(id: number, reclamation: Reclamation): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.api}/reclamations/${id}`, reclamation);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/reclamations/${id}`);
  }

  respond(id: number, response: string): Observable<any> {
    return this.http.post(`${this.api}/reclamations/${id}/respond`, { response });
  }

  reject(id: number): Observable<any> {
    return this.http.post(`${this.api}/reclamations/${id}/reject`, {});
  }

  progress(id: number, userId: number): Observable<any> {
    return this.http.post(`${this.api}/reclamations/${id}/${userId}/progress`, {});
  }

  // ✅ Ajout nécessaire : rejet par l'admin d'une réclamation PENDING
  rejectByAdmin(id: number): Observable<any> {
    return this.http.post(`${this.api}/reclamations/${id}/reject`, {});
  }
}
