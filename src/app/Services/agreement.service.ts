import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

const API_URL = "http://localhost:8089/innoxpert/agreement";
@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  constructor(private http: HttpClient) { }

  hasApprovedInternship(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${API_URL}/hasApprovedInternship/${userId}`);
  }

}
