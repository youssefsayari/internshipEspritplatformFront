import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Post} from "../models/post";
import {InternshipRemark} from "../models/internship-remark";
import {Remark} from "../models/remark";
import {tap} from "rxjs/operators";

const API_URL = "http://localhost:8089/innoxpert/internshipRemark";

@Injectable({
  providedIn: 'root'
})
export class InternshipRemarkService {

  constructor(private http: HttpClient) { }

  addInternshipRemark(internshipRemark: InternshipRemark): Observable<any> {
    return this.http.post<any>(`${API_URL}/add`, internshipRemark,{ responseType: 'text' as 'json' });
  }

  getInternshipRemarksByInternshipId(internshipId: number): Observable<Remark[]> {
    return this.http.get<any>(`${API_URL}/getByInternshipId/${internshipId}`).pipe(
      tap(response => {
        console.log('Response from API:', response); // Affiche la réponse
      })
    );
  }

}
