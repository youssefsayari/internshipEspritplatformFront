import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting } from '../Model/Meeting';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private baseUrl = 'http://localhost:8089/innoxpert/meeting';

  constructor(private http: HttpClient) {}

  getAllMeetings(): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/getAllMeetings`);
  }

  getMeetingById(idMeeting: number): Observable<Meeting> {
    return this.http.get<Meeting>(`${this.baseUrl}/getMeetingById/${idMeeting}`);
  }

  addMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.baseUrl}/addMeeting`, meeting);
  }

  updateMeeting(meeting: Meeting): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/updateMeeting`, meeting);
  }

  deleteMeetingById(idMeeting: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteMeeting/${idMeeting}`);
  }

  approveMeetingById(idMeeting: number): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/approveMeetingById/${idMeeting}`, null);
  }
  disapproveMeetingById(idMeeting: number, reason: string): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/disapproveMeetingById/${idMeeting}`, reason, {
      headers: { 'Content-Type': 'application/json' } // Spécifier le format JSON
    });
  }
  
  getStudentsByTutorId(tutorId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getStudentsByTutorId/${tutorId}`);
  }
  addMeetingAndAffectToParticipant(meeting: Meeting, organiserId: number, participantId: number): Observable<Meeting> {
    return this.http.post<Meeting>(`${this.baseUrl}/addMeetingAndAffectToParticipant/${organiserId}/${participantId}`, meeting);
  }

  updateMeetingAndAffectToParticipant(meeting: Meeting, organiserId: number, participantId: number): Observable<Meeting> {
    return this.http.put<Meeting>(`${this.baseUrl}/updateMeetingAndAffectToParticipant/${organiserId}/${participantId}`, meeting);
  }
  getMeetingsByStudent(studentId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/getMeetingsByStudent/${studentId}`);
  }
  getMeetingsByTutor(tutorId: number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/getMeetingsByTutor/${tutorId}`);
  }

  getMeetingsByStudentAndTutor(studentId: number,tutorId:number): Observable<Meeting[]> {
    return this.http.get<Meeting[]>(`${this.baseUrl}/getMeetingsByStudentAndTutor/${studentId}/${tutorId}`);
  }
  
  findTutorIdByStudentId(studentId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/findTutorIdByStudentId/${studentId}`);
  }
  getMostActiveStudents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getMostActiveStudents`);
  }
}
