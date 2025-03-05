import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";

const API_URL = "http://localhost:8089/innoxpert/user/decode-token-Role";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  decodeTokenRole(token: string): Observable<User> {
    return this.http.post<User>(API_URL, token);
  }
}
