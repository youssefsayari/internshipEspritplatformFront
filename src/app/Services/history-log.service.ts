import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HistoryLog } from '../models/history-log';

@Injectable({
  providedIn: 'root'
})
export class HistoryLogService {
  private api = 'http://localhost:8089/innoxpert/api/history-logs';

  constructor(private http: HttpClient) {}

  getAllLogs(): Observable<HistoryLog[]> {
    return this.http.get<HistoryLog[]>(this.api);
  }
}
