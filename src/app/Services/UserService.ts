import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Model/User';  // Assure-toi d'avoir un modèle User

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8090/innoxpert/user';  // URL de ton backend Spring Boot

  constructor(private http: HttpClient) { }

 // Récupérer le type d'utilisateur
 getUserType(idUser: number): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/getTypeUser/${idUser}`);
  }
}
