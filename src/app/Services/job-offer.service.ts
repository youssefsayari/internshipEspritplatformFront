import { Injectable } from '@angular/core';
import { JobOffer } from '../Model/JobOffer';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JobOfferService {

  private baseUrl = 'http://localhost:8089/innoxpert/api/joboffers'; // Adjust to your backend port

  constructor(private http: HttpClient) {}

  createJobOffer(jobOffer: JobOffer, companyId: number): Observable<JobOffer> {
    return this.http.post<JobOffer>(`${this.baseUrl}/create/${companyId}`, jobOffer);
  }

  getAll(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(this.baseUrl);
  }

  getById(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.baseUrl}/${id}`);
  }
}
