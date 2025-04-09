import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from '../Model/Post';  // Assure-toi d'avoir un modèle Post

@Injectable({
  providedIn: 'root'
})
export class PostService {

  private baseUrl = 'http://localhost:8089/innoxpert/post';  // URL de ton backend Spring Boot

  constructor(private http: HttpClient) { }

  // Récupérer tous les posts
  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getAllPosts`);
  }
  // Récupérer tous les posts
  getAllPostsDTO(): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getAllPostsDTO`);
  }

  // Récupérer les posts d'une entreprise spécifique
  getPostsByCompanyDTO(companyId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getPostsByCompanyDTO/${companyId}`);
  }
  // Récupérer un post par ID
  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/getPostById/${postId}`);
  }

  // Récupérer les posts d'une entreprise spécifique
  getPostsByCompany(companyId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getPostsByCompany/${companyId}`);
  }

   // Ajouter un post et l'affecter à une entreprise avec une image
   addPostAndAffectToCompany(companyId: number, post: Post): Observable<Post> {

    return this.http.post<Post>(`${this.baseUrl}/addPostAndAffectToCompany/${companyId}`,post);
  }

  // Supprimer un post par ID
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deletePost/${postId}`);
  }

  // Mettre à jour un post
  updatePost(post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/updatePost`, post);
  }

  // Récupérer le fil d'actualité de l'utilisateur
  getHomeFeed(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.baseUrl}/getHomeFeed/${userId}`);
  }

  // Nouvelle méthode pour analyser une offre de stage avec Mistral AI
  analyzeInternshipOffer(content: string): Observable<Map<string, string>> {
    // Encoder le contenu pour l'URL
    const encodedContent = encodeURIComponent(content);
    
    return this.http.get<Map<string, string>>(
      `${this.baseUrl}/analyze?content=${encodedContent}`
    ).pipe(
      map(response => {
        // Convertir l'objet réponse en Map si nécessaire
        if (!(response instanceof Map)) {
          return new Map(Object.entries(response));
        }
        return response;
      })
    );
  }

}
