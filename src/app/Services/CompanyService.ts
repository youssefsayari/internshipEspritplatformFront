import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Company, CompanyAnalyticsDto } from '../Model/Company';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl = 'http://localhost:8089/innoxpert/company';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }

  getCompanyIdByUserId(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/getCompanyIdByUserId/company/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  isUserInCompany(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/IsCompany/company/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  addCompanyAndAssignUser(company: Company, file: File): Observable<Company> {
    const formData = new FormData();
    formData.append('company', new Blob([JSON.stringify(company)], { type: 'application/json' }));
    formData.append('file', file);

    return this.http.post<Company>(`${this.baseUrl}/add`, formData); // No headers
  }


  getCompanyByUserId(userId: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/getCompanyByUserId/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  updateCompany(companyId: number, companyData: Company): Observable<Company> {
    return this.http.put<Company>(`${this.baseUrl}/updateCompany/${companyId}`, companyData, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getCompanyById(companyId: number): Observable<Company> {
    return this.http.get<Company>(`${this.baseUrl}/getCompanyById/${companyId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  followCompany(userId: number, companyId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${companyId}/follow/${userId}`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    }).pipe(map(() => ({ success: true })));
  }

  unfollowCompany(userId: number, companyId: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/${companyId}/unfollow/${userId}`, {}, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    }).pipe(map(() => ({ success: true })));
  }

  isFollowingCompany(userId: number, companyId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/isFollowing/${companyId}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getCompanyFollowers(companyId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getCompanyFollowers/${companyId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getCompaniesFollowedByUser(userId: number): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/getCompaniesFollowedByUser/${userId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  enrichCompanyData(name?: string, website?: string): Observable<Company> {
    let params = new HttpParams();
    if (name) params = params.append('name', name);
    if (website) params = params.append('website', website);

    return this.http.get<Company>(`${this.baseUrl}/api/autocomplete/enrich`, {
      params}).pipe(catchError(this.handleError));
  }

  deleteCompany(companyId: number): Observable<{ success: boolean, message: string }> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.baseUrl}/deleteCompany/${companyId}`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  getCompaniesAnalytics(): Observable<CompanyAnalyticsDto[]> {
    return this.http.get<CompanyAnalyticsDto[]>(`${this.baseUrl}/analytics`, {
      headers: this.getAuthHeaders()
    }).pipe(catchError(this.handleError));
  }

  sendPartnershipEmail(email: string, message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/sendPartnershipEmail`, { email, message }, {
      headers: this.getAuthHeaders()
    });
  }
}
