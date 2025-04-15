import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { InternshipRemark } from "../models/internship-remark";
import { Observable } from "rxjs";
import { Remark } from "../models/remark";
import { tap } from "rxjs/operators";
import { AgreementRemark } from "../models/agreement-remark";

const API_URL = "http://localhost:8089/innoxpert/agreementRemark";

@Injectable({
  providedIn: 'root'
})
export class AgreementRemarkService {

  constructor(private http: HttpClient) { }

  // ✅ Get Authorization headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Ajouter une remarque d'accord
  addAgreementRemark(agreementRemark: AgreementRemark): Observable<any> {
    return this.http.post<any>(
      `${API_URL}/add`, 
      agreementRemark, 
      {
        headers: this.getAuthHeaders(),
        responseType: 'text' as 'json'
      }
    );
  }

  // ✅ Récupérer les remarques par accord
  getAgreementRemarksByAgreementId(idAgreement: number): Observable<AgreementRemark[]> {
    return this.http.get<AgreementRemark[]>(
      `${API_URL}/getByAgreementId/${idAgreement}`, 
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log('Response from API:', response);
      })
    );
  }
}
