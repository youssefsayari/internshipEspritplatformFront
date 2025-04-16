import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {TimeLine} from "../models/time-line";
import {tap} from "rxjs/operators";

const API_URL = "http://localhost:8089/innoxpert/timeline";
@Injectable({
  providedIn: 'root'
})
export class TimeLineService {

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addTimeLine(userId: number, agreementId: number): Observable<void> {
    return this.http.post<void>(
      `${API_URL}/add`,
      { userId, agreementId },
      { headers: this.getAuthHeaders(), responseType: 'text' as 'json' }
    );
  }


  getTimeLinesByUserId(userId: number): Observable<TimeLine[]> {
    return this.http.get<TimeLine[]>(
      `${API_URL}/user/${userId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      tap(response => {
        console.log('Response from API:', response);
      })
    );
  }


  acceptStep(title: string, userId: number, note: number): Observable<any> {
    return this.http.put(
      `${API_URL}/accept-step`,
      null,
      {
        headers: this.getAuthHeaders(),
        params: { title, userId: userId.toString(), note: note.toString() },
        responseType: 'text' as 'json'
      }
    );
  }


  rejectStep(title: string, userId: number, note: number): Observable<any> {
    return this.http.put(
      `${API_URL}/reject-step`,
      null,
      {
        headers: this.getAuthHeaders(),
        params: { title, userId: userId.toString(), note: note.toString() },
        responseType: 'text' as 'json'
      }
    );
  }


  uploadDocument(file: File, type: string, studentId: number, nomEtape: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('studentId', studentId.toString());
    formData.append('nomEtape', nomEtape);

    return this.http.post(`${API_URL}/upload`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
      })
    });
  }


  downloadDocument(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${API_URL}/download/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'blob',
      observe: 'response'
    });
  }







}
