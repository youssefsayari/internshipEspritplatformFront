import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelPredictionService {

  private baseUrl = 'http://localhost:8089/innoxpert/modelprediction';
  private flaskUrl = 'http://127.0.0.1:5000/recommend';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    const headers = new HttpHeaders();
    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
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
    }).pipe(
      catchError(() => of('⚠️ Une erreur est survenue lors de la prédiction.'))
    );
  }
  getRecommendations(skills: string, top_n: number = 5): Observable<any> {
    const body = {
      skills: skills,
      top_n: top_n
    };

    return this.http.post(this.flaskUrl, body, {
      headers: this.getAuthHeaders(),
      responseType: 'json'
    }).pipe(
      catchError(() => of({ error: '⚠️ Une erreur est survenue lors de la récupération des recommandations.' }))
    );
  }
}
