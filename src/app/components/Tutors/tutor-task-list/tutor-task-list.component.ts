import { Component, OnInit } from '@angular/core';
import { Task } from '../../../Model/Task';
import { TaskService } from '../../../Services/taskservice.service';
import { UserService } from '../../../Services/user.service';
import { User } from '../../../Model/User';
import { TypeStatus } from '../../../Model/TypeStatus';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MeetingService } from '../../../Services/MeetingService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tutor-task-list',
  templateUrl: './tutor-task-list.component.html',
  styleUrls: ['./tutor-task-list.component.scss']
})
export class TutorTaskListComponent implements OnInit {
  students: User[] = [];
  selectedStudentId: number | null = null;
  tasks: Task[] = [];
  tutorId: number;
  statuses = ['TODO', 'INPROGRESS', 'DONE'] as TypeStatus[];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    const token = localStorage.getItem('Token');
    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          this.tutorId = userDetails.id;
          this.loadStudents();
          Swal.fire({
            title: '👨‍🏫 Welcome!',
            text: 'Please select a student to view their tasks.',
            icon: 'info',
            confirmButtonText: 'OK'
          });
        },
        error: (err) => console.error('Error fetching user details', err)
      });
    }
  }

  loadStudents() {
    this.meetingService.getStudentsByTutorId(this.tutorId).subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (err) => console.error('Failed to load students', err)
    });
  }

  onStudentChange(): void {
    if (this.selectedStudentId) {
      this.taskService.getTasksByUserId(this.selectedStudentId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (err) => console.error('Error loading tasks:', err)
      });
    }
  }

  getTasksByStatus(status: TypeStatus): Task[] {
    return this.tasks.filter(task => task.status === status);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, newStatus: TypeStatus): void {
    const task: Task = event.item.data;
    if (task.status !== newStatus) {
      this.taskService.changeTaskStatus(task.idTask, newStatus).subscribe({
        next: () => {
          task.status = newStatus;
        },
        error: (err) => {
          console.error('Failed to update task status:', err);
        }
      });
    }
  }

  iconForStatus(status: TypeStatus): string {
    switch (status) {
      case 'TODO':
        return 'fas fa-list-ul';
      case 'INPROGRESS':
        return 'fas fa-spinner fa-pulse';
      case 'DONE':
        return 'fas fa-check-circle';
      default:
        return '';
    }
  }

  statusLabel(status: TypeStatus): string {
    switch (status) {
      case 'TODO':
        return '📝 To Do';
      case 'INPROGRESS':
        return '⏳ In Progress';
      case 'DONE':
        return '✅ Done';
      default:
        return '';
    }
  }
}
