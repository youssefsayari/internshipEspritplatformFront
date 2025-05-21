import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../Model/image';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private baseUrl = 'http://localhost:8089/innoxpert/cloudinary';

  constructor(private httpClient: HttpClient) { }

  public list(): Observable<Image[]> {
    return this.httpClient.get<Image[]>(`${this.baseUrl}/list`);
    
  }

  public upload(image: File): Observable<any> {
    const formData = new FormData();
    formData.append('multipartFile', image);
    return this.httpClient.post<any>(`${this.baseUrl}/upload`, formData).pipe(
      catchError(error => {
        console.error('Erreur lors de l’upload:', error);
        return throwError(error);
      })
    );
  }









  public delete(id: any): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/delete/${id}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression de l\'image:', error);
        return throwError(error);
      })
    );
  }
  

} 