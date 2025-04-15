import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { QuizUser } from '../models/quiz-user';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuizUserService {
  private baseUrl = 'http://localhost:8089/innoxpert/quiz-user';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Enregistrer les résultats du quiz
  saveQuizResult(quizUser: QuizUser): Observable<QuizUser> {
    return this.http.post<QuizUser>(`${this.baseUrl}/saveQuizResult`, quizUser, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'enregistrement du résultat du quiz:', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // ✅ Vérifier si l'utilisateur a déjà passé le quiz
  hasUserTakenQuiz(userId: number, quizId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/${userId}/${quizId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
