import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8089/innoxpert/notifications';

  constructor(private http: HttpClient) {}

  // 🔐 Auth header generator
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ✅ Récupérer les notifications pour un user
  getNotificationsForUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  // ✅ Marquer une notification comme lue
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/read/${notificationId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }
}
