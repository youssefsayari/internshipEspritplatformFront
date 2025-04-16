import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = 'http://localhost:8089/innoxpert/documents';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('Token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      })
    };
  }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}/getAllDocuments`, this.getAuthHeaders());
  }


  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.baseUrl}/getDocumentById/${id}`, this.getAuthHeaders());
  }


  addDocument(formData: FormData): Observable<Document> {
    const token = localStorage.getItem('Token');
    return this.http.post<Document>(`${this.baseUrl}/addDocument`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }



  uploadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/uploadDocument/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({ 'Authorization': `Bearer ${localStorage.getItem('Token')}` })
    });
  }


  updateDocument(document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.baseUrl}/updateDocument`, document, this.getAuthHeaders());
  }


  removeDocumentById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteDocument/${id}`, this.getAuthHeaders());
  }


  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/downloadDocument/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        'Accept': 'application/octet-stream'
      })
    });
  }


  downloadPredefinedDocument(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${fileName}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        'Accept': 'application/octet-stream'
      })
    });
  }

  uploadDocuments(formData: FormData): Observable<any> {
    const token = localStorage.getItem('Token');
    return this.http.post<any>(`${this.baseUrl}/uploadDocuments`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    });
  }

  generateStudentCV(userId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/generateStudentCV/${userId}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        'Accept': 'application/pdf'
      })
    });
  }

  downloadStudentCV(userId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/downloadStudentCV/${userId}`, {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('Token')}`,
        'Accept': 'application/pdf'
      })
    });
  }




}
