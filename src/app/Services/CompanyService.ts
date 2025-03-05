import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Company } from '../Model/Company'; // Assure-toi d'avoir le modèle Comment

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl = 'http://localhost:8090/innoxpert/company'; // URL du backend Spring Boot

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir l'ID de l'entreprise en fonction de l'ID de l'utilisateur
  getCompanyIdByUserId(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/getCompanyIdByUserId/company/${userId}`);
}
 // Nouvelle méthode pour vérifier si l'utilisateur appartient à une entreprise
 isUserInCompany(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/IsCompany/company/${userId}`);
  }
}
