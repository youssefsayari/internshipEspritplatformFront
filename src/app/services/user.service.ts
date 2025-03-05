import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";
import {UserResponse} from "../models/user-response";

const API_URL = "http://localhost:8089/innoxpert/user";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  decodeTokenRole(token: string): Observable<User> {
    return this.http.post<User>(`${API_URL}/decode-token-Role`, token);
  }

  getUserBytypeUser(role: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${API_URL}/getUserBytypeUser?typeUser=${role}`);
  }

  deleteUserById(idUser: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/deleteUser/${idUser}`);
  }
  affectTutor(userId: number, tutorId: number): Observable<string> {
    return this.http.post<string>(`${API_URL}/affectation/${userId}/${tutorId}`, null, { responseType: 'text' as 'json' });
  }

  updateTutorAdd(key: string, userId: number): Observable<string> {
    return this.http.put<string>(`${API_URL}/updateAdd/${userId}?key=${key}`, null, { responseType: 'text' as 'json' });
  }

  updateTutorRem(key: string, userId: number): Observable<string> {
    return this.http.put<string>(`${API_URL}/updateRem/${userId}?key=${key}`, null, { responseType: 'text' as 'json' });
  }


}
