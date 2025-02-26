import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../models/post";
import {InternshipAddrequest} from "../models/internship-addrequest";


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

}
