import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionReponse } from '../models/questionreponse';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'http://localhost:8089/innoxpert/question';
  private apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple&category=18';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getQuestionsByQuizId(idQuiz: number): Observable<QuestionReponse[]> {
    return this.http.get<QuestionReponse[]>(`${this.baseUrl}/getQuestionsByQuizId/${idQuiz}`, {
      headers: this.getAuthHeaders()
    });
  }

  getQuestionById(idQuestionReponse: number): Observable<QuestionReponse> {
    return this.http.get<QuestionReponse>(`${this.baseUrl}/getQuestionById/${idQuestionReponse}`, {
      headers: this.getAuthHeaders()
    });
  }

  addQuestionAndAssignToQuiz(question: QuestionReponse, idQuiz: number): Observable<QuestionReponse> {
    return this.http.post<QuestionReponse>(`${this.baseUrl}/addQuestionAndAssignToQuiz/${idQuiz}`, question, {
      headers: this.getAuthHeaders()
    });
  }

  updateQuestion(question: QuestionReponse): Observable<QuestionReponse> {
    return this.http.put<QuestionReponse>(`${this.baseUrl}/updateQuestion`, question, {
      headers: this.getAuthHeaders()
    });
  }

  deleteQuestion(idQuestionReponse: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteQuestion/${idQuestionReponse}`, {
      headers: this.getAuthHeaders()
    });
  }

  // ✅ Public endpoint - no auth
  getTriviaQuestions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
