import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { InternshipDetailsDTO } from "../models/internship-details-dto";
import { AgreementRequestDTO } from "../models/agreement-request-dto";
import { AgreementDTO } from "../models/agreement-dto";

const API_URL = "http://localhost:8089/innoxpert/agreement";

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  hasApprovedInternship(userId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${API_URL}/hasApprovedInternship/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  getApprovedInternships(studentId: number): Observable<InternshipDetailsDTO[]> {
    return this.http.get<InternshipDetailsDTO[]>(
      `${API_URL}/getInternshipsForStudent/${studentId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  addAgreement(agreement: AgreementRequestDTO): Observable<any> {
    return this.http.post<any>(
      `${API_URL}/addAgreement`,
      agreement,
      {
        headers: this.getAuthHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  getAgreementByStudentId(studentId: number): Observable<AgreementDTO> {
    return this.http.get<AgreementDTO>(
      `${API_URL}/getAgreementById?studentId=${studentId}`,
      { headers: this.getAuthHeaders() }
    );
  }

  approveAgreement(agreementId: number): Observable<string> {
    return this.http.post<string>(
      `${API_URL}/approveAgreement/${agreementId}`,
      null,
      {
        headers: this.getAuthHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  acceptAgreement(agreementId: number): Observable<string> {
    return this.http.post<string>(
      `${API_URL}/acceptAgreement/${agreementId}`,
      null,
      {
        headers: this.getAuthHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  rejectAgreement(agreementId: number): Observable<string> {
    return this.http.post<string>(
      `${API_URL}/rejectAgreement/${agreementId}`,
      null,
      {
        headers: this.getAuthHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  downloadAgreementPDF(agreementId: number): Observable<Blob> {
    return this.http.get(`${API_URL}/download-pdf/${agreementId}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob'
    });
  }
}
