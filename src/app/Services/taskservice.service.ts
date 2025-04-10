import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../Model/Task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:8089/innoxpert/task';

  constructor(private http: HttpClient) {}

  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/getAllTasks`);
  }

  getTaskById(idTask: number): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/getTaskById/${idTask}`);
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/addTask`, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/updateTask`, task);
  }

  deleteTask(idTask: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteTask/${idTask}`);
  }

  addTaskAndAssignToStudent(task: Task, idUser: number): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/addTaskAndAssignToStudent/${idUser}`, task);
  }
  updateTaskAndAssignToStudent(task: Task, idUser: number): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/updateAndAssignTaskToStudent/${idUser}`, task);
  }

  changeTaskStatus(idTask: number, typeStatus: string): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/changeTaskStatus/${idTask}/${typeStatus}`, {});
  }

  getTasksByUserId(idUser: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/getTasksByUserId`, {
      params: { idUser: idUser.toString() }
    });
  }
  findStudentWithMostDoneTasks(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/findStudentWithMostDoneTasks`);
  }
  getStudentsWithDoneTasks(tutorId: number): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.baseUrl}/students-done-tasks/${tutorId}`);
  }
  countDoneTasksByStudent(studentId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/done-tasks-count/${studentId}`);
  }
  rateTask(taskId: number, note: number): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/rateTask/${taskId}/${note}`, {});
  }
  sendHelpRequest(taskId: number, message: string): Observable<string> {
    const body = { message }; 
    return this.http.post(`${this.baseUrl}/help-request/${taskId}`, body, { responseType: 'text' });
  }
  getAISuggestion(taskId: number, message: string): Observable<string> {
    const body = { message };
    return this.http.post(`${this.baseUrl}/ai-suggestion/${taskId}`, body, { responseType: 'text' });
  }
  
  

}
