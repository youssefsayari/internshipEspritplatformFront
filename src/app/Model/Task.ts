import { User } from './User';
import { TypeStatus } from './TypeStatus';



export interface Task {
  idTask?: number; 
  description: string;
  status: TypeStatus;
  student: User;
  mark?: number; 
  deadline?: Date;
}
