import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../models/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = 'http://localhost:8090/innoxpert/documents';

  constructor(private http: HttpClient) {}

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.baseUrl}/getAllDocuments`);
  }

  getDocumentById(id: number): Observable<Document> {
    return this.http.get<Document>(`${this.baseUrl}/getDocumentById/${id}`);
  }

  addDocument(formData: FormData): Observable<Document> {
    return this.http.post<Document>(`${this.baseUrl}/addDocument`, formData);
  }
  

  uploadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/uploadDocument/${id}`, { responseType: 'blob' });
  }

  updateDocument(document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.baseUrl}/updateDocument`, document);
  }

  removeDocumentById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteDocument/${id}`);
  }

  // ✅ Download Document by ID
  downloadDocument(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/downloadDocument/${id}`, {
      responseType: 'blob',
      headers: new HttpHeaders().set('Accept', 'application/octet-stream')
    });
  }

  // ✅ Download Predefined Documents (lettre_affectation, demande_de_stage, journal, convention_de_stage)
  downloadPredefinedDocument(fileName: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download/${fileName}`, {
      responseType: 'blob',
      headers: new HttpHeaders().set('Accept', 'application/octet-stream')
    });
  }
  //uplod multiple documents 
  uploadDocuments(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/uploadDocuments`, formData);
  }
  // Method to generate student CV
generateStudentCV(userId: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/generateStudentCV/${userId}`, {
    responseType: 'blob',
    headers: new HttpHeaders().set('Accept', 'application/pdf')
  });
}

// Method to download student CV
downloadStudentCV(userId: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/downloadStudentCV/${userId}`, {
    responseType: 'blob',
    headers: new HttpHeaders().set('Accept', 'application/pdf')
  });
}
// ✅ Check for plagiarism in a student's report
checkPlagiarism(report: File): Observable<string> {
  const formData = new FormData();
  formData.append('report', report);

  return this.http.post<string>(`${this.baseUrl}/checkPlagiarism`, formData);
}
 
  
}
