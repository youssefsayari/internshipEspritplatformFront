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
}
