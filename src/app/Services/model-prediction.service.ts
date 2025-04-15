import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModelPredictionService {

  private baseUrl = 'http://localhost:8089/innoxpert/modelprediction'; 

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  predict(option: string, subject: string, company: string): Observable<string> {
    const params = new HttpParams()
      .set('option', option)
      .set('subject', subject)
      .set('company', company);

    return this.http.post(this.baseUrl, null, {
      headers: this.getAuthHeaders(),
      params,
      responseType: 'text' 
    });
  }
}
