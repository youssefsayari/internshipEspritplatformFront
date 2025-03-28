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
  editingTask: Task | null = null;

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
  editTask(task: Task): void {
    Swal.fire({
      title: '✏️ Edit Task',
      html:
        `<textarea id="description" class="swal2-textarea" placeholder="Description" rows="4">${task.description}</textarea>` +
        `<select id="status" class="swal2-select" style="margin-top:10px;">
          <option value="TODO" ${task.status === 'TODO' ? 'selected' : ''}>📝 TODO</option>
          <option value="INPROGRESS" ${task.status === 'INPROGRESS' ? 'selected' : ''}>⏳ IN PROGRESS</option>
          <option value="DONE" ${task.status === 'DONE' ? 'selected' : ''}>✅ DONE</option>
        </select>`,
      showCancelButton: true,
      confirmButtonText: '✅ Update',
      cancelButtonText: '❌ Cancel',
      preConfirm: () => {
        const updatedDescription = (document.getElementById('description') as HTMLTextAreaElement).value;
        const updatedStatus = (document.getElementById('status') as HTMLSelectElement).value;
  
        if (!updatedDescription.trim()) {
          Swal.showValidationMessage('Description is required.');
          return;
        }
  
        return {
          ...task,
          description: updatedDescription.trim(),
          status: updatedStatus as TypeStatus
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedTask: Task = result.value;
        this.taskService.updateTaskAndAssignToStudent(updatedTask, this.selectedStudentId!).subscribe({
          next: () => {
            Swal.fire('✅ Updated', 'Task updated successfully!', 'success');
            this.onStudentChange();
          },
          error: (err) => {
            console.error('Error updating task:', err);
            Swal.fire('❌ Error', 'Could not update the task.', 'error');
          }
        });
      }
    });
  }
  
  
  deleteTask(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.taskService.deleteTask(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Task has been deleted.', 'success');
            this.onStudentChange(); // reload tasks
          },
          error: (err) => console.error('Error deleting task', err)
        });
      }
    });
  }
}
