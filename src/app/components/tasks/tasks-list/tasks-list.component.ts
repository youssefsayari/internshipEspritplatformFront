import { Component, OnInit } from '@angular/core';
import { Task } from '../../../Model/Task';

@Component({
  selector: 'app-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.css']
})
export class TasksListComponent  {

  constructor() { }

  tasks: Task[] = [
    { id: 1, title: 'First Task', description: 'Details of first task', status: 'ToDo' },
    { id: 2, title: 'Second Task', description: 'Details of second task', status: 'InProgress' },
    { id: 3, title: 'Third Task', description: 'Details of third task', status: 'Done' },
    // Add more tasks as needed
  ];

  getTasksByStatus(status: 'ToDo' | 'InProgress' | 'Done'): Task[] {
    return this.tasks.filter(task => task.status === status);
  }
  iconForStatus(status: string): string {
    switch (status) {
      case 'ToDo':
        return 'fas fa-list-ul';
      case 'InProgress':
        return 'fas fa-spinner fa-pulse';
      case 'Done':
        return 'fas fa-check-circle';
      default:
        return '';
    }
  }
  

}
