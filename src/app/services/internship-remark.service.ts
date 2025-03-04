import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../models/post";
import {InternshipRemark} from "../models/internship-remark";

const API_URL = "http://localhost:8089/innoxpert/internshipRemark";

@Injectable({
  providedIn: 'root'
})
export class InternshipRemarkService {

  constructor(private http: HttpClient) { }

  addInternshipRemark(internshipRemark: InternshipRemark): Observable<any> {
    return this.http.post<any>(`${API_URL}/add`, internshipRemark,{ responseType: 'text' as 'json' });
  }
  getInternshipRemarksByInternshipId(internshipId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/getByInternshipId/${internshipId}`,{ responseType: 'text' as 'json' });
  }
}
