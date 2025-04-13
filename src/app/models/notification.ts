import { Quiz } from "./quiz";
import { User } from "./user";
export interface Notification {
    id: number;
    message: string;
    dateEnvoi: Date;
    vue: boolean;
    user?: User;
    quiz?: Quiz;
  }
  