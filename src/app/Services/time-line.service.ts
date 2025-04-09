import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {TimeLine} from "../models/time-line";
import {tap} from "rxjs/operators";

const API_URL = "http://localhost:8089/innoxpert/timeline";
@Injectable({
  providedIn: 'root'
})
export class TimeLineService {

  constructor(private http: HttpClient) { }

  addTimeLine(userId: number, agreementId: number): Observable<void> {
    return this.http.post<void>(`${API_URL}/add`, { userId, agreementId }, { responseType: 'text' as 'json' });
  }

  getTimeLinesByUserId(userId: number): Observable<TimeLine[]> {
    return this.http.get<TimeLine[]>(`${API_URL}/user/${userId}`).pipe(
      tap(response => {
        console.log('Response from API:', response);
      })
    );
  }

}
