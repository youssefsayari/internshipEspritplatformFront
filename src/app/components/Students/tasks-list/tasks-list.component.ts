import { Component, OnInit } from '@angular/core';
import { Task } from '../../../Model/Task';
import { TaskService } from '../../../Services/taskservice.service';
import { TypeStatus } from '../../../Model/TypeStatus';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { UserService } from '../../../Services/user.service';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent implements OnInit {
  tasks: Task[] = [];
  studentId: number ;
  statuses = ['TODO', 'INPROGRESS', 'DONE'] as TypeStatus[];

  constructor(private taskService: TaskService,private userService : UserService) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }
  fetchUserDetails() {
    const token = localStorage.getItem('Token');

    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          if (userDetails.role || userDetails.classe) {
            localStorage.setItem('userRole', userDetails.role);
            localStorage.setItem('userClasse', userDetails.classe);
            this.studentId=userDetails.id;
            console.log("the student is ", this.studentId);
            this.loadTasksForStudent();


          }
        },
        error: (err) => {
          console.log('Error fetching user details:', err);
        }
      });
    }
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

  onTaskDrop(event: CdkDragDrop<Task[]>, newStatus: TypeStatus): void {
    const task: Task = event.item.data;
  
    if (task.status !== newStatus) {
      this.taskService.changeTaskStatus(task.idTask, newStatus).subscribe({
        next: () => {
          task.status = newStatus;
  
          if (newStatus === 'DONE') {
            this.celebrateTaskCompletion();
          }
        },
        error: (err) => {
          console.error('Failed to update task status:', err);
        }
      });
    }
  }
  celebrateTaskCompletion() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  
    Swal.fire({
      title: 'Well done!',
      text: 'Task completed 💪',
      icon: 'success',
      confirmButtonText: 'Thanks!',
      timer: 2000,
      timerProgressBar: true
    });
  }

  openHelpDialog(task: Task) {
    Swal.fire({
      title: `Need help with Task?`,
      input: 'textarea',
      inputLabel: 'Describe your issue',
      inputPlaceholder: 'Type your question or issue here...',
      showCancelButton: true,
      confirmButtonText: 'Send',
      preConfirm: (message) => {
        if (!message) {
          Swal.showValidationMessage('Message cannot be empty');
        }
        return message;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.sendHelpRequest(task, result.value);
      }
    });
  }
  
  sendHelpRequest(task: Task, message: string) {
    const helpRequest = {
      taskId: task.idTask,
      studentId: this.studentId,
      message: message,
      date: new Date()
    };
  
    console.log("Help Request Sent: ", helpRequest);
  
  
    Swal.fire('Sent!', 'Your request has been sent to your instructor.', 'success');
  }
  

}
