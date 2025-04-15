import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Image } from '../Model/image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private baseUrl = 'http://localhost:8089/innoxpert/cloudinary';

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  public list(): Observable<Image[]> {
    return this.httpClient.get<Image[]>(`${this.baseUrl}/list`, {
      headers: this.getAuthHeaders()
    });
  }

  public upload(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('multipartFile', image);

    return this.httpClient.post<any>(`${this.baseUrl}/upload`, formData, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('Token')}`
        // NOTE: Do not add 'Content-Type': 'multipart/form-data' manually when using FormData
      })
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de l’upload:', error);
        return throwError(() => error);
      })
    );
  }

  public delete(id: any): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${id}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression de l\'image:', error);
        return throwError(() => error);
      })
    );
  }
}
