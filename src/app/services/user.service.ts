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

}
