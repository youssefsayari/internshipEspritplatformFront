import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Rating } from '../Model/Rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://localhost:8089/innoxpert/rating';

  constructor(private http: HttpClient) {}

  // 🔐 JWT Authorization Header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Ajouter ou mettre à jour la note d'un utilisateur pour un post
  addRatingToPost(postId: number, userId: number, stars: number): Observable<Rating> {
    const url = `${this.baseUrl}/addRatingToPost/${postId}/${userId}/${stars}`;
    return this.http.post<Rating>(url, {}, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'ajout ou de la mise à jour du rating:', error);
        return throwError(() => new Error('Erreur lors de l\'ajout ou de la mise à jour du rating'));
      })
    );
  }

  // ✅ Récupérer la note d'un utilisateur pour un post
  getMyRatingForPost(postId: number, userId: number): Observable<Rating> {
    const url = `${this.baseUrl}/getMyRatingForPost/${postId}/${userId}`;
    return this.http.get<Rating>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du rating:', error);
        return throwError(() => new Error('Erreur lors de la récupération du rating'));
      })
    );
  }

  // ✅ Vérifier si un utilisateur a noté un post
  hasUserRated(postId: number, userId: number): Observable<boolean> {
    const url = `${this.baseUrl}/hasRated/${postId}/${userId}`;
    return this.http.get<boolean>(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Erreur lors de la vérification du rating:', error);
        return throwError(() => new Error('Erreur lors de la vérification du rating'));
      })
    );
  }
}
