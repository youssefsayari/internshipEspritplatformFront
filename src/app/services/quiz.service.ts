import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = 'http://localhost:8089/innoxpert/quiz';

  constructor(private http: HttpClient) {}

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.baseUrl}/getAllQuizzes`);
  }

  getQuizById(idQuiz: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.baseUrl}/getQuizById/${idQuiz}`);
  }

  addQuizAndAssignToSociete(quiz: Quiz, idSociete: number): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.baseUrl}/addQuizAndAssignToSociete/${idSociete}`, quiz);
  }

  updateQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.baseUrl}/updateQuiz`, quiz);
  }

  deleteQuiz(idQuiz: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteQuiz/${idQuiz}`);
  }
}