import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../models/post";
import {InternshipAddrequest} from "../models/internship-addrequest";
import {InternshipAdminResponse} from "../models/internship-admin-response";


const API_URL = "http://localhost:8089/innoxpert/internship";
@Injectable({
  providedIn: 'root'
})
export class InternshipService {

  constructor(private http: HttpClient) { }

  addInternship(InternshipAddrequest): Observable<string> {
    return this.http.post(`${API_URL}/addInternship`, InternshipAddrequest, { responseType: 'text' });
  }

  getInternships(idUser?: number, idPost?: number): Observable<any[]> {
    let params: any = {};
    if (idUser) params.idUser = idUser;
    if (idPost) params.idPost = idPost;

    return this.http.get<any[]>(`${API_URL}/getInternshipByCriteria`, { params });
  }

  deleteInternship(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/removeInternshipById/${id}`, { responseType: 'text' });
  }

  getInternshipsForAdmin(idPost?: number): Observable<InternshipAdminResponse[]> {
    let params = new HttpParams();
    if (idPost) {
      params = params.set('idPost', idPost.toString());
    }
    return this.http.get<InternshipAdminResponse[]>(`${API_URL}/getInternshipsForAdmin`, { params });
  }

  affectValidator(internshipId: number, tutorId: number): Observable<string> {
    return this.http.post<string>(`${API_URL}/affectationV/${internshipId}/${tutorId}`, null, { responseType: 'text' as 'json' });
  }

  approveInternship(internshipId: number): Observable<string> {
    return this.http.post<string>(`${API_URL}/approveInternship/${internshipId}`, null, { responseType: 'text' as 'json' });
  }

  rejectInternship(internshipId: number): Observable<string> {
    return this.http.post<string>(`${API_URL}/rejectInternship/${internshipId}`, null, { responseType: 'text' as 'json' });
  }

}
