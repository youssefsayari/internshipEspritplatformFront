import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Quiz } from '../models/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = 'http://localhost:8089/innoxpert/quiz';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllQuizzes(): Observable<Quiz[]> {
    return this.http.get<Quiz[]>(`${this.baseUrl}/getAllQuizzes`, {
      headers: this.getAuthHeaders()
    });
  }

  getQuizById(idQuiz: number): Observable<Quiz> {
    return this.http.get<Quiz>(`${this.baseUrl}/getQuizById/${idQuiz}`, {
      headers: this.getAuthHeaders()
    });
  }

  addQuizAndAssignToSociete(quiz: Quiz, idSociete: number): Observable<Quiz> {
    return this.http.post<Quiz>(`${this.baseUrl}/addQuizAndAssignToSociete/${idSociete}`, quiz, {
      headers: this.getAuthHeaders()
    });
  }

  updateQuiz(quiz: Quiz): Observable<Quiz> {
    return this.http.put<Quiz>(`${this.baseUrl}/updateQuiz`, quiz, {
      headers: this.getAuthHeaders()
    });
  }

  deleteQuiz(idQuiz: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteQuiz/${idQuiz}`, {
      headers: this.getAuthHeaders()
    });
  }
}
