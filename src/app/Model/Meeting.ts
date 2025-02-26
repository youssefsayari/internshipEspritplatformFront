import { TypeMeeting } from "./TypeMeeting.enum";
import { User } from "./User";

export interface Meeting {
    idMeeting?: number;
    date: Date;
    heure: string;
    description: string;
    typeMeeting: TypeMeeting;
    organiser: User;
    participant: User;
    approved: boolean;
    link : string;
  }