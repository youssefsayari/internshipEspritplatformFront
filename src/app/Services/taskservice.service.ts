import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../Model/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8089/innoxpert/task';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    console.log(token);
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/getAllTasks`, { headers: this.getAuthHeaders() });
  }

  getTaskById(idTask: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/getTaskById/${idTask}`, { headers: this.getAuthHeaders() });
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/addTask`, task, { headers: this.getAuthHeaders() });
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/updateTask`, task, { headers: this.getAuthHeaders() });
  }

  deleteTask(idTask: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteTask/${idTask}`, { headers: this.getAuthHeaders() });
  }

  addTaskAndAssignToStudent(task: Task, idUser: number): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/addTaskAndAssignToStudent/${idUser}`, task, { headers: this.getAuthHeaders() });
  }

  updateTaskAndAssignToStudent(task: Task, idUser: number): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/updateAndAssignTaskToStudent/${idUser}`, task, { headers: this.getAuthHeaders() });
  }

  changeTaskStatus(idTask: number, typeStatus: string): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/changeTaskStatus/${idTask}/${typeStatus}`, {}, { headers: this.getAuthHeaders() });
  }

  getTasksByUserId(idUser: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/getTasksByUserId`, {
      headers: this.getAuthHeaders(),
      params: { idUser: idUser.toString() }
    });
  }

  findStudentWithMostDoneTasks(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/findStudentWithMostDoneTasks`, { headers: this.getAuthHeaders() });
  }

  getStudentsWithDoneTasks(tutorId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/students-done-tasks/${tutorId}`, { headers: this.getAuthHeaders() });
  }

  countDoneTasksByStudent(studentId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/done-tasks-count/${studentId}`, { headers: this.getAuthHeaders() });
  }

  rateTask(taskId: number, note: number): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/rateTask/${taskId}/${note}`, {}, { headers: this.getAuthHeaders() });
  }

  sendHelpRequest(taskId: number, message: string): Observable<string> {
    const body = { message }; 
    return this.http.post(`${this.baseUrl}/help-request/${taskId}`, body, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }

  getAISuggestion(taskId: number, message: string): Observable<string> {
    const body = { message };
    return this.http.post(`${this.baseUrl}/ai-suggestion/${taskId}`, body, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    });
  }
}
