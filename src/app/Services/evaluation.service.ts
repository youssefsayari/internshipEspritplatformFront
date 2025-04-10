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

  submitEvaluation(evaluation: Evaluation): Observable<Evaluation> {
    return this.http.post<Evaluation>(this.baseUrl, evaluation);
  }

  getDefenseEvaluations(defenseId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.baseUrl}/defense/${defenseId}`);
  }

  getEvaluation(evaluationId: number): Observable<Evaluation> {
    return this.http.get<Evaluation>(`${this.baseUrl}/${evaluationId}`);
  }
}