import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../Model/Company'; // Assure-toi d'avoir le modèle Comment
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl = 'http://localhost:8089/innoxpert/company'; // URL du backend Spring Boot

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir l'ID de l'entreprise en fonction de l'ID de l'utilisateur
  getCompanyIdByUserId(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/getCompanyIdByUserId/company/${userId}`);
}
 // Nouvelle méthode pour vérifier si l'utilisateur appartient à une entreprise
 isUserInCompany(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/IsCompany/company/${userId}`);
  }
  addCompanyAndAssignUser(company: Company, file: File): Observable<Company> {
    const formData = new FormData();
    formData.append('company', new Blob([JSON.stringify(company)], { type: 'application/json' })); // Envoyer la Company
    formData.append('file', file); // Envoyer le fichier image
  
    // Ajouter les en-têtes nécessaires
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
  
    return this.http.post<Company>(`${this.baseUrl}/add`, formData, { headers });
  }
    // Nouvelle méthode pour récupérer l'entreprise complète par userId
    getCompanyByUserId(userId: number): Observable<Company> {
      return this.http.get<Company>(`${this.baseUrl}/getCompanyByUserId/${userId}`).pipe(
        catchError(error => {
          throw new Error('Failed to fetch company: ' + error.message);
        })
      );
    }




}
