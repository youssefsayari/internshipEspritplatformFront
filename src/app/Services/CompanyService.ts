import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Company } from '../Model/Company'; // Assure-toi d'avoir le modèle Comment
import { CompanyAnalyticsDto } from '../Model/Company'; // Assure-toi d'avoir le modèle Comment
import { catchError, map } from 'rxjs/operators';
import { User } from '../Model/User'; // Ensure the correct path to the User model


@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl = 'http://localhost:8089/innoxpert/company'; // URL du backend Spring Boot

  constructor(private http: HttpClient) {}

    // Headers pour les requêtes JSON
    private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

      // Gestion des erreurs
  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

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
    updateCompany(companyId: number, companyData: Company): Observable<Company> {
      const url = `${this.baseUrl}/updateCompany/${companyId}`;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      
      return this.http.put<Company>(url, companyData, { headers }).pipe(
        catchError(error => {
          console.error('Full error response:', error);
          let errorMsg = 'Failed to update company';
          if (error.error) {
            // Try to extract validation messages from backend
            if (typeof error.error === 'string') {
              errorMsg += `: ${error.error}`;
            } else if (error.error.message) {
              errorMsg += `: ${error.error.message}`;
            } else if (Array.isArray(error.error)) {
              errorMsg += `: ${error.error.join(', ')}`;
            }
          }
          return throwError(() => new Error(errorMsg));
        })
      );
    }
  // Nouvelle méthode pour récupérer une entreprise par son ID
  getCompanyById(companyId: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/getCompanyById/${companyId}`).pipe(
      catchError(error => {
        throw new Error('Failed to fetch company by ID: ' + error.message);
      })
    );
  }
// Dans CompanyService
followCompany(userId: number, companyId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/${companyId}/follow/${userId}`, {}, {
    responseType: 'text' // Accepter les réponses texte
  }).pipe(
    map(() => ({ success: true })) // Convertir en objet valide
  );
}

unfollowCompany(userId: number, companyId: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/${companyId}/unfollow/${userId}`, {}, {
    responseType: 'text' // Accepter les réponses texte
  }).pipe(
    map(() => ({ success: true })) // Convertir en objet valide
  );
}

// Ajoutez cette méthode pour vérifier si l'utilisateur suit déjà l'entreprise
isFollowingCompany(userId: number, companyId: number): Observable<boolean> {
  return this.http.get<boolean>(`${this.baseUrl}/isFollowing/${companyId}/${userId}`);
}

// Dans CompanyService
getCompanyFollowers(companyId: number): Observable<User[]> {
  return this.http.get<User[]>(`${this.baseUrl}/getCompanyFollowers/${companyId}`).pipe(
    catchError(error => {
      throw new Error('Failed to fetch company followers: ' + error.message);
    })
  );
}
// Dans CompanyService (service Angular)

getCompaniesFollowedByUser(userId: number): Observable<Company[]> {
  return this.http.get<Company[]>(`${this.baseUrl}/getCompaniesFollowedByUser/${userId}`).pipe(
    catchError(error => {
      console.error('Failed to fetch followed companies:', error);
      throw new Error('Failed to fetch followed companies: ' + error.message);
    })
  );
}

enrichCompanyData(name?: string, website?: string): Observable<Company> {
  let params = new HttpParams();
  if (name) params = params.append('name', name);
  if (website) params = params.append('website', website);

  return this.http.get<Company>(`${this.baseUrl}/api/autocomplete/enrich`, { params })
    .pipe(catchError(this.handleError));
}

deleteCompany(companyId: number): Observable<{success: boolean, message: string}> {
  return this.http.delete<{success: boolean, message: string}>(`${this.baseUrl}/deleteCompany/${companyId}`).pipe(
    catchError(error => {
      console.error('Full delete error:', error);
      let errorMsg = 'Failed to delete company';
      
      if (error.error) {
        // Try to extract server error message
        if (typeof error.error === 'string') {
          errorMsg += `: ${error.error}`;
        } else if (error.error.message) {
          errorMsg += `: ${error.error.message}`;
        }
      } else if (error.message) {
        errorMsg += `: ${error.message}`;
      }
      
      return throwError(() => new Error(errorMsg));
    })
  );
}

// Ajoutez cette méthode dans votre CompanyService
getCompaniesAnalytics(): Observable<CompanyAnalyticsDto[]> {
  return this.http.get<CompanyAnalyticsDto[]>(`${this.baseUrl}/analytics`).pipe(
    catchError(error => {
      console.error('Error fetching companies analytics:', error);
      return throwError(() => new Error('Failed to fetch companies analytics: ' + error.message));
    })
  );
}

sendPartnershipEmail(email: string, message: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/sendPartnershipEmail`, { email, message });
}
}