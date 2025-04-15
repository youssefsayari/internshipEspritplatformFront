import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { InternshipRemark } from "../models/internship-remark";
import { Remark } from "../models/remark";
import { tap } from "rxjs/operators";

const API_URL = "http://localhost:8089/innoxpert/internshipRemark";

@Injectable({
  providedIn: 'root'
})
export class InternshipRemarkService {

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addInternshipRemark(internshipRemark: InternshipRemark): Observable<any> {
    return this.http.post<any>(
      `${API_URL}/add`,
      internshipRemark,
      {
        headers: this.getAuthHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  getInternshipRemarksByInternshipId(internshipId: number): Observable<Remark[]> {
    return this.http.get<Remark[]>(
      `${API_URL}/getByInternshipId/${internshipId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log('Response from API:', response);
      })
    );
  }

}
