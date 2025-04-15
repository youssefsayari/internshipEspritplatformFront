import { Component, OnInit } from '@angular/core';
import { Task } from '../../../Model/Task';
import { TaskService } from '../../../Services/taskservice.service';
import { UserService } from '../../../Services/user.service';
import { User } from '../../../Model/User';
import { TypeStatus } from '../../../Model/TypeStatus';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MeetingService } from '../../../Services/MeetingService';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';


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
  topStudent: User | null = null;


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
        this.findTopStudent();
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
          this.findTopStudent();

  
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
    const formattedDeadline = task.deadline
      ? new Date(task.deadline).toISOString().split('T')[0]
      : '';
  
    Swal.fire({
      title: '✏️ Edit Task',
      html: `
        <div style="text-align:left;">
          <label style="font-weight:600; display:block; margin-bottom:5px;">📝 Description:</label>
          <textarea id="description" class="swal2-textarea" placeholder="Enter description" rows="4">${task.description}</textarea>
  
          <label style="font-weight:600; margin-top:15px; display:block;">📌 Status:</label>
          <select id="status" class="swal2-select" style="margin-top:5px;">
            <option value="TODO" ${task.status === 'TODO' ? 'selected' : ''}>📝 TODO</option>
            <option value="INPROGRESS" ${task.status === 'INPROGRESS' ? 'selected' : ''}>⏳ IN PROGRESS</option>
            <option value="DONE" ${task.status === 'DONE' ? 'selected' : ''}>✅ DONE</option>
          </select>
  
          <label style="font-weight:600; margin-top:15px; display:block;">📅 Deadline:</label>
          <input type="date" id="deadline" class="swal2-input" value="${formattedDeadline}">
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '✅ Update',
      cancelButtonText: '❌ Cancel',
      preConfirm: () => {
        const updatedDescription = (document.getElementById('description') as HTMLTextAreaElement).value.trim();
        const updatedStatus = (document.getElementById('status') as HTMLSelectElement).value;
        const deadlineStr = (document.getElementById('deadline') as HTMLInputElement).value;
  
        if (updatedDescription.length < 5 || updatedDescription.length > 255) {
          Swal.showValidationMessage('La description doit contenir entre 5 et 255 caractères.');
          return;
        }
  
        if (!deadlineStr) {
          Swal.showValidationMessage('Deadline is required.');
          return;
        }
  
        const updatedDeadline = new Date(deadlineStr);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() );
        if (updatedDeadline < tomorrow) {
          Swal.showValidationMessage('Deadline must be tomorrow or after.');
          return;
        }
  
        return {
          ...task,
          description: updatedDescription,
          status: updatedStatus as TypeStatus,
          deadline: updatedDeadline
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedTask: Task = result.value;
        this.taskService.updateTaskAndAssignToStudent(updatedTask, this.selectedStudentId!).subscribe({
          next: () => {
            Swal.fire('✅ Updated', 'Task updated successfully!', 'success');
            this.onStudentChange();
            this.findTopStudent();
          },
          error: (err) => {
            console.error('Error updating task:', err);
            Swal.fire('❌ Error', 'Could not update the task.', 'error');
          }
        });
      }
    });
  }




  
  
  openAddTask(): void {
    const defaultDescriptions = [
      '🛠️ Set up local development environment and tools',
      '📥 Clone project repository and run the application locally',
      '🗂️ Design or update database schema for the project',
      '🔗 Create or update REST API endpoints',
      '✍️ Implement CRUD operations in the backend',
      '🎨 Develop UI components for data display and input',
      '🔄 Integrate frontend with backend APIs',
      '✅ Add form validation on the client side',
      '🔐 Implement user authentication (login/register)',
      '🛡️ Secure backend routes using JWT',
      '👤 Manage user roles and access control',
      '🧪 Write unit tests for backend services',
      '🐛 Perform manual testing and fix bugs',
      '🌀 Push code using Git and create pull requests',
      '👥 Participate in code reviews and sprint meetings',
      '📝 Write project documentation and API reference',
      '🚀 Deploy project to staging or testing environment',
      '🎤 Prepare demo or presentation for project milestone',
      '⚙️ Optimize performance of backend queries',
      '💡 Improve UI/UX for better usability'
    ];
    
    
  
    Swal.fire({
      title: '➕ Add New Task',
      html: `
       <div style="text-align:left;">
    <label style="font-weight:600;">📝 Choose a Default Description:</label>
    <select id="defaultDescSelect" class="swal2-select" style="width: 80%; font-size: 0.9rem;">
      <option value="">-- Select a default task --</option>
      ${defaultDescriptions.map(desc => `<option value="${desc}">${desc}</option>`).join('')}
    </select>
    <br><br>
  
          <label style="font-weight:600;">✍️ Or Write Custom Description:</label>
          <textarea id="newDescription" class="swal2-textarea" placeholder="Enter task description"></textarea>
          <br>
  
          <label style="font-weight:600;">📌 Status:</label>
          <br>
          <select id="newStatus" class="swal2-select">
            <option value="TODO">📝 TODO</option>
            <option value="INPROGRESS">⏳ IN PROGRESS</option>
            <option value="DONE">✅ DONE</option>
          </select>
          <br><br>
  
          <label style="font-weight:600;">📅 Deadline:</label>
          <br>
          <input type="date" id="newDeadline" class="swal2-input">
        </div>
      `,
      didOpen: () => {
        const defaultSelect = document.getElementById('defaultDescSelect') as HTMLSelectElement;
        const textarea = document.getElementById('newDescription') as HTMLTextAreaElement;
  
        defaultSelect.addEventListener('change', () => {
          if (defaultSelect.value) {
            textarea.value = defaultSelect.value;
          }
        });
      },
      showCancelButton: true,
      confirmButtonText: '➕ Add',
      cancelButtonText: '❌ Cancel',
      preConfirm: () => {
        const desc = (document.getElementById('newDescription') as HTMLTextAreaElement).value.trim();
        const status = (document.getElementById('newStatus') as HTMLSelectElement).value;
        const deadlineStr = (document.getElementById('newDeadline') as HTMLInputElement).value;
  
        if (desc.length < 5 || desc.length > 255) {
          Swal.showValidationMessage('Description must contain between 5 and 255 characters.');
          return;
        }
  
        if (!deadlineStr) {
          Swal.showValidationMessage('Deadline is required.');
          return;
        }
  
        const deadlineDate = new Date(deadlineStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
  
        if (deadlineDate < today) {
          Swal.showValidationMessage('Deadline must be today or later.');
          return;
        }
  
        return {
          description: desc,
          status: status as TypeStatus,
          deadline: deadlineDate
        };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newTask: Task = {
          idTask: 0,
          description: result.value.description,
          status: result.value.status,
          deadline: result.value.deadline,
          student: { idUser: this.selectedStudentId! }
        };
  
        this.taskService.addTaskAndAssignToStudent(newTask, this.selectedStudentId!).subscribe({
          next: () => {
            Swal.fire('✅ Added', 'Task successfully added.', 'success');
            this.onStudentChange();
            this.findTopStudent();
          },
          error: (err) => {
            console.error('Error adding task:', err);
            Swal.fire('❌ Error', 'Could not add task. Select student to affect the task.', 'error');
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
            this.onStudentChange(); 
            this.findTopStudent();

          },
          error: (err) => console.error('Error deleting task', err)
        });
      }
    });
  }
  
  findTopStudent(): void {
    this.taskService.findStudentWithMostDoneTasks().subscribe({
      next: (student) => {
        this.topStudent = student;
       
      },
      error: (err) => console.error('Error finding top student:', err)
    });
  }



  showStudentDetails(): void {
    if (!this.students || this.students.length === 0) {
      Swal.fire('📋 No Students', 'No students found for this tutor.', 'info');
      return;
    }
  
    let studentListHtml = '';
  
    const fetchCounts = async () => {
      for (const student of this.students) {
        try {
          const doneCount = await this.taskService.countDoneTasksByStudent(student.idUser!).toPromise();
          studentListHtml += `👨‍🎓 ${student.firstName} ${student.lastName}: ✅ ${doneCount} Done Tasks<br>`;
        } catch (error) {
          console.error(`Error fetching tasks for ${student.firstName} ${student.lastName}:`, error);
          studentListHtml += `👨‍🎓 ${student.firstName} ${student.lastName}: ❌ Error fetching tasks<br>`;
        }
      }
  
      Swal.fire({
        title: '📋 Student Task Details',
        html: studentListHtml,
        icon: 'info',
        confirmButtonText: 'OK'
      });
    };
  
    fetchCounts();
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

  rateTask(task: Task): void {
    Swal.fire({
      title: '⭐ Rate Task',
      input: 'number',
      inputLabel: 'Enter a score out of 100',
      inputAttributes: {
        min: '0',
        max: '100'
      },
      inputValue: task.mark ?? '',
      showCancelButton: true,
      confirmButtonText: '✅ Rate',
      cancelButtonText: '❌ Cancel',
      inputValidator: (value) => {
        const score = Number(value);
        if (isNaN(score) || score < 0 || score > 100) {
          return 'Please enter a valid number between 0 and 100';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed && result.value !== undefined) {
        const note = Number(result.value);
        this.taskService.rateTask(task.idTask!, note).subscribe({
          next: (updatedTask) => {
            Swal.fire('✅ Rated', `Task rated ${note}/100`, 'success');
            task.mark = note;
          },
          error: (err) => {
            console.error('Error rating task:', err);
            Swal.fire('❌ Error', 'Could not rate the task.', 'error');
          }
        });
      }
    });
  }
  

}
