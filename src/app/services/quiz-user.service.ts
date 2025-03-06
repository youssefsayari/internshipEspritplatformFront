import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuizUser } from '../models/quiz-user'; 
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

 // Assure-toi que tu as un modèle QuizUser

@Injectable({
  providedIn: 'root'
})
export class QuizUserService {
  private baseUrl = 'http://localhost:8090/innoxpert/quiz-user';  // Change si nécessaire

  constructor(private http: HttpClient) {}

  // Méthode pour enregistrer les résultats du quiz
  saveQuizResult(quizUser: QuizUser): Observable<QuizUser> {
    return this.http.post<QuizUser>(`${this.baseUrl}/saveQuizResult`, quizUser).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'enregistrement du résultat du quiz:', error);
        return throwError(() => new Error(error));
      })
    );
  } 
  hasUserTakenQuiz(userId: number, quizId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/exists/${userId}/${quizId}`);
  }
  }