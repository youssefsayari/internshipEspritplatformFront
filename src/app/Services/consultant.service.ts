import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Consultant } from '../models/consullting';

@Injectable({
  providedIn: 'root'
})
export class ConsultantService {

  private apiUrl = 'http://localhost:8089/innoxpert/api/consultants';

  constructor(private http: HttpClient) {}

  // Create or update consultant
  createConsultant(consultant: Consultant): Observable<Consultant> {
    return this.http.post<Consultant>(`${this.apiUrl}`, consultant);
  }

  // Update consultant by ID
  updateConsultant(id: number, consultant: Consultant): Observable<Consultant> {
    return this.http.put<Consultant>(`${this.apiUrl}/${id}`, consultant);
  }

  // Check if email exists
  checkEmailExists(email: string, excludeId?: number): Observable<boolean> {
    let params = new HttpParams().set('email', email);
    if (excludeId != null) {
      params = params.set('excludeId', excludeId.toString());
    }
    return this.http.get<boolean>(`${this.apiUrl}/email-exists`, { params });
  }

  // Get all consultants
  getAllConsultants(): Observable<Consultant[]> {
    return this.http.get<Consultant[]>(`${this.apiUrl}`);
  }

  // Get consultant by ID
  getConsultantById(id: number): Observable<Consultant> {
    return this.http.get<Consultant>(`${this.apiUrl}/${id}`);
  }

  // Get consultant by email
  getConsultantByEmail(email: string): Observable<Consultant> {
    return this.http.get<Consultant>(`${this.apiUrl}/email/${email}`);
  }

  // Delete consultant by ID
  deleteConsultant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
