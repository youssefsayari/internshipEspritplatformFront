import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, Consultation } from '../models/consullting';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private baseUrl = 'http://localhost:8089/innoxpert/api/clients';

  constructor(private http: HttpClient) {}

  // ➕ Register new client
  registerClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}`, client);
  }

  // 📋 Get all clients
  getAllClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}`);
  }

  // 🔍 Get client by ID
  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/${id}`);
  }

  // ✏️ Update client
  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/${id}`, client);
  }

  // ❌ Delete client
  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // 📅 View client consultations
  getClientConsultations(clientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.baseUrl}/${clientId}/consultations`);
  }

  // 📆 Request a consultation
  requestConsultation(clientId: number, specialty: string, startTime: string, endTime: string): Observable<Consultation> {
    const params = new HttpParams()
      .set('specialty', specialty)
      .set('startTime', startTime)
      .set('endTime', endTime);

    return this.http.post<Consultation>(`${this.baseUrl}/${clientId}/request-consultation`, null, { params });
  }

  // 🧠 Match consultants based on a problem description
 /* matchConsultants(request: ConsultationRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/match-consultants`, request);
  }*/

  // ✅ Get all consultations
  getAllConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.baseUrl}/consultations`);
  }

  // ✅ Get consultation by ID
  getConsultationById(id: number): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.baseUrl}/consultation/${id}`);
  }

  // ✅ Get consultations by consultant ID
  getConsultationsByConsultant(consultantId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.baseUrl}/by-consultant/${consultantId}`);
  }

  // ✅ Get consultations by client ID
  getConsultationsByClient(clientId: number): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.baseUrl}/by-client/${clientId}`);
  }
}
