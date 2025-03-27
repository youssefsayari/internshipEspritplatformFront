import { Component, OnInit } from '@angular/core';
import { Task } from '../../../Model/Task';
import { TaskService } from '../../../Services/taskservice.service';
import { TypeStatus } from '../../../Model/TypeStatus';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  studentId: number = 2;
  statuses = [TypeStatus.TODO, TypeStatus.INPROGRESS, TypeStatus.DONE];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasksForStudent();
  }

  loadTasksForStudent(): void {
    this.taskService.getTasksByUserId(this.studentId).subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: (err) => {
        console.error('Error loading tasks:', err);
      }
    });
  }

  getTasksByStatus(status: TypeStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  iconForStatus(status: TypeStatus): string {
    switch (status) {
      case TypeStatus.TODO:
        return 'fas fa-list-ul';
      case TypeStatus.INPROGRESS:
        return 'fas fa-spinner fa-pulse';
      case TypeStatus.DONE:
        return 'fas fa-check-circle';
      default:
        return '';
    }
  }

  statusLabel(status: TypeStatus): string {
    switch (status) {
      case TypeStatus.TODO:
        return '📝 To Do';
      case TypeStatus.INPROGRESS:
        return '⏳ In Progress';
      case TypeStatus.DONE:
        return '✅ Done';
      default:
        return '';
    }
  }
}
