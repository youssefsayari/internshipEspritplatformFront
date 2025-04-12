import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8089/innoxpert/notifications';

  constructor(private http: HttpClient) {}

  // ✅ Récupérer les notifications pour un user
  getNotificationsForUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/${userId}`);
  }
  
  // ✅ Marquer une notification comme lue
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/read/${notificationId}`, {});
  }
  
}
