import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError,map } from 'rxjs/operators'; // Import pour la gestion des erreurs
import { Rating } from '../Model/Rating'; // Assure-toi d'avoir le modèle Rating

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private baseUrl = 'http://localhost:8090/innoxpert/rating'; // URL du backend Spring Boot

  constructor(private http: HttpClient) {}


  
   // Ajouter ou mettre à jour la note d'un utilisateur pour un post spécifique
   addRatingToPost(postId: number, userId: number, stars: number): Observable<Rating> {
    const url = `${this.baseUrl}/addRatingToPost/${postId}/${userId}/${stars}`;
    return this.http.post(url, {}).pipe(
      map(response => response as Rating), // On cast la réponse en type Rating
      catchError(error => {
        console.error('Erreur lors de l\'ajout ou de la mise à jour du rating:', error);
        return throwError(() => new Error('Erreur lors de l\'ajout ou de la mise à jour du rating'));
      })
    );
  }

 

  // Récupérer la note d'un utilisateur pour un post spécifique
  getMyRatingForPost(postId: number, userId: number): Observable<Rating> {
    const url = `${this.baseUrl}/getMyRatingForPost/${postId}/${userId}`;
    return this.http.get<Rating>(url).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération du rating:', error);
        return throwError(() => new Error('Erreur lors de la récupération du rating'));
      })
    );
  }

   // Vérifier si un utilisateur a noté un post spécifique
   hasUserRated(postId: number, userId: number): Observable<boolean> {
    const url = `${this.baseUrl}/hasRated/${postId}/${userId}`; // Correction de l'URL
    return this.http.get<boolean>(url).pipe(
      catchError(error => {
        console.error('Erreur lors de la vérification du rating:', error);
        return throwError(() => new Error('Erreur lors de la vérification du rating'));
      })
    );
  }
}
