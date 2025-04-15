import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpResponse} from '@angular/common/http';
import {TimeLine} from "../models/time-line";
import {tap} from "rxjs/operators";

const API_URL = "http://localhost:8089/innoxpert/timeline";
@Injectable({
  providedIn: 'root'
})
export class TimeLineService {

  constructor(private http: HttpClient) { }

  addTimeLine(userId: number, agreementId: number): Observable<void> {
    return this.http.post<void>(`${API_URL}/add`, { userId, agreementId }, { responseType: 'text' as 'json' });
  }

  getTimeLinesByUserId(userId: number): Observable<TimeLine[]> {
    return this.http.get<TimeLine[]>(`${API_URL}/user/${userId}`).pipe(
      tap(response => {
        console.log('Response from API:', response);
      })
    );
  }

  acceptStep(title: string, userId: number, note: number): Observable<any> {
    return this.http.put(`${API_URL}/accept-step`, null, {
      params: { title, userId: userId.toString(), note: note.toString() },
      responseType: 'text' as 'json'
    });
  }

  rejectStep(title: string, userId: number, note: number): Observable<any> {
    return this.http.put(`${API_URL}/reject-step`, null, {
      params: { title, userId: userId.toString(), note: note.toString() },
      responseType: 'text' as 'json'
    });
  }

  uploadDocument(file: File, type: string, studentId: number, nomEtape: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('studentId', studentId.toString());
    formData.append('nomEtape', nomEtape);

    return this.http.post(`${API_URL}/upload`, formData);
  }

  downloadDocument(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${API_URL}/download/${id}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }






}
