import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../Model/Post';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:8089/innoxpert/post';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getAllPosts`, {
      headers: this.getAuthHeaders()
    });
  }

  getAllPostsDTO(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getAllPostsDTO`, {
      headers: this.getAuthHeaders()
    });
  }

  getPostsByCompanyDTO(companyId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getPostsByCompanyDTO/${companyId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/getPostById/${postId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getPostsByCompany(companyId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getPostsByCompany/${companyId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addPostAndAffectToCompany(companyId: number, post: Post): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/addPostAndAffectToCompany/${companyId}`, post, {
      headers: this.getAuthHeaders()
    });
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletePost/${postId}`, {
      headers: this.getAuthHeaders()
    });
  }

  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/updatePost`, post, {
      headers: this.getAuthHeaders()
    });
  }

  getHomeFeed(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getHomeFeed/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  analyzeInternshipOffer(content: string): Observable<Map<string, string>> {
    const encodedContent = encodeURIComponent(content);
    return this.http.get<Map<string, string>>(
      `${this.baseUrl}/analyze?content=${encodedContent}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      map(response => {
        return response instanceof Map ? response : new Map(Object.entries(response));
      })
    );
  }
  getPostsByTitles(titles: string[]): Observable<Post[]> {
    return this.http.post<Post[]>(`${this.baseUrl}/byTitles`, titles, {
      headers: this.getAuthHeaders()
    });
  }


}
