import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuestionReponse } from '../models/questionreponse';

@Injectable({
    providedIn: 'root'
  })
  export class QuestionService {
    private baseUrl = 'http://localhost:8090/innoxpert/question';
    private apiUrl = 'https://opentdb.com/api.php?amount=10&type=multiple&category=18';


  
    constructor(private http: HttpClient) {}
  
    getQuestionsByQuizId(idQuiz: number): Observable<QuestionReponse[]> {
      return this.http.get<QuestionReponse[]>(`${this.baseUrl}/getQuestionsByQuizId/${idQuiz}`);
    }
  
    getQuestionById(idQuestionReponse: number): Observable<QuestionReponse> {
      return this.http.get<QuestionReponse>(`${this.baseUrl}/getQuestionById/${idQuestionReponse}`);
    }
  
    addQuestionAndAssignToQuiz(question: QuestionReponse, idQuiz: number): Observable<QuestionReponse> {
      return this.http.post<QuestionReponse>(`${this.baseUrl}/addQuestionAndAssignToQuiz/${idQuiz}`, question);
    }
  
    updateQuestion(question: QuestionReponse): Observable<QuestionReponse> {
      return this.http.put<QuestionReponse>(`${this.baseUrl}/updateQuestion`, question);
    }
  
    deleteQuestion(idQuestionReponse: number): Observable<void> {
      return this.http.delete<void>(`${this.baseUrl}/deleteQuestion/${idQuestionReponse}`);
    }
    getTriviaQuestions(): Observable<any> {
      return this.http.get<any>(this.apiUrl);
    }
  }
  