import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {InternshipRemark} from "../models/internship-remark";
import {Observable} from "rxjs";
import {Remark} from "../models/remark";
import {tap} from "rxjs/operators";
import {AgreementRemark} from "../models/agreement-remark";

const API_URL = "http://localhost:8089/innoxpert/agreementRemark";
@Injectable({
  providedIn: 'root'
})
export class AgreementRemarkService {

  constructor(private http: HttpClient) { }

  addAgreementRemark(agreementRemark: AgreementRemark): Observable<any> {
    return this.http.post<any>(`${API_URL}/add`, agreementRemark,{ responseType: 'text' as 'json' });
  }

  getAgreementRemarksByAgreementId(idAgreement: number): Observable<AgreementRemark[]> {
    return this.http.get<any>(`${API_URL}/getByAgreementId/${idAgreement}`).pipe(
      tap(response => {
        console.log('Response from API:', response);
      })
    );
  }
}
