import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../Model/Comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = 'http://localhost:8089/innoxpert/comments';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/getAll`, {
      headers: this.getAuthHeaders()
    });
  }

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}/getByPost/${postId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCommentById(commentId: number): Observable<Comment> {
    return this.http.get<Comment>(`${this.baseUrl}/getById/${commentId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addCommentToPostAndUser(postId: number, userId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/addToPostAndUser/${postId}/${userId}`, comment, {
      headers: this.getAuthHeaders()
    });
  }

  addReplyToComment(parentCommentId: number, comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/addReply/${parentCommentId}`, comment, {
      headers: this.getAuthHeaders()
    });
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.http.put<Comment>(`${this.baseUrl}/update`, comment, {
      headers: this.getAuthHeaders()
    });
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${commentId}`, {
      headers: this.getAuthHeaders()
    });
  }
}
