import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting } from '../Model/Meeting';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private baseUrl = 'http://localhost:8089/innoxpert/meeting';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/getAllMeetings`, { headers: this.getAuthHeaders() });
  }

  getMeetingById(idMeeting: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.baseUrl}/getMeetingById/${idMeeting}`, { headers: this.getAuthHeaders() });
  }

  addMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.baseUrl}/addMeeting`, meeting, { headers: this.getAuthHeaders() });
  }

  updateMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/updateMeeting`, meeting, { headers: this.getAuthHeaders() });
  }

  deleteMeetingById(idMeeting: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteMeeting/${idMeeting}`, { headers: this.getAuthHeaders() });
  }

  approveMeetingById(idMeeting: number): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/approveMeetingById/${idMeeting}`, null, { headers: this.getAuthHeaders() });
  }

  disapproveMeetingById(idMeeting: number, reason: string): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/disapproveMeetingById/${idMeeting}`, reason, { headers: this.getAuthHeaders() });
  }

  getStudentsByTutorId(tutorId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getStudentsByTutorId/${tutorId}`, { headers: this.getAuthHeaders() });
  }

  addMeetingAndAffectToParticipant(meeting: Meeting, organiserId: number, participantId: number): Observable<Meeting> {
    return this.http.post<Meeting>(
      `${this.baseUrl}/addMeetingAndAffectToParticipant/${organiserId}/${participantId}`,
      meeting,
      { headers: this.getAuthHeaders() }
    );
  }

  updateMeetingAndAffectToParticipant(meeting: Meeting, organiserId: number, participantId: number): Observable<Meeting> {
    return this.http.put<Meeting>(
      `${this.baseUrl}/updateMeetingAndAffectToParticipant/${organiserId}/${participantId}`,
      meeting,
      { headers: this.getAuthHeaders() }
    );
  }

  getMeetingsByStudent(studentId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/getMeetingsByStudent/${studentId}`, { headers: this.getAuthHeaders() });
  }

  getMeetingsByTutor(tutorId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/getMeetingsByTutor/${tutorId}`, { headers: this.getAuthHeaders() });
  }

  getMeetingsByStudentAndTutor(studentId: number, tutorId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/getMeetingsByStudentAndTutor/${studentId}/${tutorId}`, { headers: this.getAuthHeaders() });
  }

  findTutorIdByStudentId(studentId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/findTutorIdByStudentId/${studentId}`, { headers: this.getAuthHeaders() });
  }

  getMostActiveStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getMostActiveStudents`, { headers: this.getAuthHeaders() });
  }
}
