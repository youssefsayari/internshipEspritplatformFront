import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../Model/Comment'; // Assure-toi d'avoir le modèle Comment

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8089/innoxpert/comments'; // URL du backend Spring Boot

  constructor(private http: HttpClient) {}

  // Récupérer tous les commentaires
  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/getAll`);
  }

  // Récupérer les commentaires d'un post spécifique
  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/getByPost/${postId}`);
  }

  // Récupérer un commentaire par ID
  getCommentById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/getById/${commentId}`);
  }

  // Ajouter un commentaire à un post et à un utilisateur
  addCommentToPostAndUser(postId: number, userId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/addToPostAndUser/${postId}/${userId}`, comment);
  }

  // Ajouter une réponse à un commentaire
  addReplyToComment(parentCommentId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/addReply/${parentCommentId}`, comment);
  }

  // Mettre à jour un commentaire
  updateComment(comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/update`, comment);
  }

  // Supprimer un commentaire
  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${commentId}`);
  }

  
}
