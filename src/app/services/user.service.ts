import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "../models/user";
import { UserResponse } from "../models/user-response";

const API_URL = "http://localhost:8089/innoxpert/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  // 🔐 Helper for auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // 🚫 Leave this one untouched (no headers)
  decodeTokenRole(token: string): Observable<User> {
    return this.http.post<User>(`${API_URL}/decode-token-Role`, token);
  }

  getUserBytypeUser(role: string): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${API_URL}/getUserBytypeUser?typeUser=${role}`, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUserById(idUser: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/deleteUser/${idUser}`, {
      headers: this.getAuthHeaders()
    });
  }

  affectTutor(userId: number, tutorId: number): Observable<string> {
    return this.http.post<string>(`${API_URL}/affectation/${userId}/${tutorId}`, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  updateTutorAdd(key: string, userId: number): Observable<string> {
    return this.http.put<string>(`${API_URL}/updateAdd/${userId}?key=${key}`, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  updateTutorRem(key: string, userId: number): Observable<string> {
    return this.http.put<string>(`${API_URL}/updateRem/${userId}?key=${key}`, null, {
      headers: this.getAuthHeaders(),
      responseType: 'text' as 'json'
    });
  }

  // 🟢 Unprotected routes (OTP & password reset)
  sendOtp(email: string): Observable<{ message: string }> {
    const headers = new HttpHeaders({ 'Content-Type': 'text/plain' });
    return this.http.post<{ message: string }>(`${API_URL}/send-otp`, email, { headers });
  }

  verifyOtp(email: string, otp: number): Observable<boolean> {
    return this.http.post<boolean>(`${API_URL}/verify-otp?email=${email}&otp=${otp}`, null);
  }

  changePassword(email: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${API_URL}/change-password?email=${email}&newPassword=${newPassword}`,
      null,
      { responseType: 'json' }
    );
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${API_URL}/getAllUsers`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${API_URL}/getUserById/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // user.service.ts
getAllTutors(): Observable<User[]> {
  return this.http.get<User[]>(`${API_URL}/getAllTutors`);
}

}
