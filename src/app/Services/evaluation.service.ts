// evaluation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evaluation } from '../models/evaluation';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private baseUrl = 'http://localhost:8089/innoxpert/evaluations'; // Added /evaluations

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): { headers: any } {
    const token = localStorage.getItem('Token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }


  submitEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.baseUrl, evaluation, this.getAuthHeaders());
  }


  getDefenseEvaluations(defenseId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.baseUrl}/defense/${defenseId}`, this.getAuthHeaders());
  }


  getEvaluation(evaluationId: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.baseUrl}/${evaluationId}`, this.getAuthHeaders());
  }

  getEvaluationByDefenseAndTutor(defenseId: number, tutorId: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.baseUrl}/defense/${defenseId}/tutor/${tutorId}`, this.getAuthHeaders());
  }




}
