import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// model-classification.service.ts
@Injectable({
  providedIn: 'root'
})
export class ModelClassificationService {
  private baseUrl = 'http://localhost:8089/innoxpert/classification';

  constructor(private http: HttpClient) {}

  classifyCompany(company: any): Observable<string> {
    const currentYear = new Date().getFullYear();
    const foundingYear = new Date(company.foundingYear).getFullYear();
    
    const dynamisme = this.calculateDynamisme(
      company.numEmployees,
      company.sector === 'TECHNOLOGY' ? 1 : 0,
      foundingYear,
      currentYear
    );

    const params = new HttpParams()
      .set('secteur', company.sector)
      .set('annee', foundingYear.toString())
      .set('employes', company.numEmployees.toString())
      .set('estTech', (company.sector === 'TECHNOLOGY' ? 1 : 0).toString())
      .set('dynamisme', dynamisme.toString());

    return this.http.post<string>(
      this.baseUrl,
      null,
      {
        params: params,
        responseType: 'text' as 'json'
      }
    ).pipe(
      map(response => {
            if (response.includes('Erreur') || response.includes('❌')) {
              return '❌ Erreur';
            }
            if (response.includes('Non-Startup')) {
              return '🏢 Non-Startup';
            }
            if (response.includes('Startup')) {
              return '🚀 Startup';
            }
            return '❌ Erreur';
          })
,
      catchError(() => of('❌ Erreur'))
    );
  }

  private calculateDynamisme(
    nombreEmployes: number,
    estTech: number,
    anneeCreation: number,
    currentYear: number
  ): number {
    const maxEmployes = 500;
    const minAnneeCreation = 1800;
    
    return (
      0.4 * (nombreEmployes / maxEmployes) +
      0.3 * estTech +
      0.3 * ((currentYear - anneeCreation) / (currentYear - minAnneeCreation))
    );
  }
}