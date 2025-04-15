import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { InternshipAddrequest } from "../models/internship-addrequest";
import { InternshipAdminResponse } from "../models/internship-admin-response";
import { InternshipTutorResponse } from "../models/internship-tutor-response";

const API_URL = "http://localhost:8089/innoxpert/internship";

@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addInternship(InternshipAddrequest: InternshipAddrequest): Observable<string> {
    return this.http.post(`${API_URL}/addInternship`, InternshipAddrequest, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  getInternships(idUser?: number, idPost?: number): Observable<any[]> {
    let params: any = {};
    if (idUser) params.idUser = idUser;
    if (idPost) params.idPost = idPost;

    return this.http.get<any[]>(`${API_URL}/getInternshipByCriteria`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  getInternshipsForTutor(idUser?: number): Observable<InternshipTutorResponse[]> {
    let params: any = {};
    if (idUser) params.idUser = idUser;

    return this.http.get<InternshipTutorResponse[]>(`${API_URL}/getInternshipsForTutor`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  deleteInternship(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/removeInternshipById/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  getInternshipsForAdmin(idPost?: number): Observable<InternshipAdminResponse[]> {
    let params = new HttpParams();
    if (idPost) {
      params = params.set('idPost', idPost.toString());
    }
    return this.http.get<InternshipAdminResponse[]>(`${API_URL}/getInternshipsForAdmin`, {
      headers: this.getAuthHeaders(),
      params
    });
  }

  affectValidator(internshipId: number, tutorId: number): Observable<string> {
    return this.http.post<string>(`${API_URL}/affectationV/${internshipId}/${tutorId}`, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  approveInternship(internshipId: number): Observable<string> {
    return this.http.post<string>(`${API_URL}/approveInternship/${internshipId}`, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  rejectInternship(internshipId: number): Observable<string> {
    return this.http.post<string>(`${API_URL}/rejectInternship/${internshipId}`, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }
}
