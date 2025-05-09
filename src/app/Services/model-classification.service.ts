import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModelClassificationService {

  private baseUrl = 'http://localhost:8089/innoxpert/classification';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    const headers = new HttpHeaders();
    return token ? headers.set('Authorization', `Bearer ${token}`) : headers;
  }

  classifyEntreprise(
    secteur: string,
    annee: number,
    employes: number,
    estTech: number,
    dynamisme: number
  ): Observable<string> {
    const headers = this.getAuthHeaders();
    
    // Utilisation de HttpParams pour les paramètres de requête
    const params = new HttpParams()
      .set('secteur', secteur)
      .set('annee', annee.toString())
      .set('employes', employes.toString())
      .set('estTech', estTech.toString())
      .set('dynamisme', dynamisme.toString());

    return this.http.post<string>(
      this.baseUrl,
      null, // Corps vide car tout est dans les paramètres
      {
        headers: headers,
        params: params,
        responseType: 'text' as 'json' // Pour gérer la réponse comme texte
      }
    ).pipe(
      catchError(this.handleError<string>('classifyEntreprise', '❌ Erreur lors de la classification'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      // Vous pouvez envoyer l'erreur à un service de logging ici
      return of(result as T);
    };
  }
}