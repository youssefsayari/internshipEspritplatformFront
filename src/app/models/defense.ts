import { User } from '././user'; 

export class Defense {
  idDefense: number;
  defenseDate: string; 
  defenseTime: string; 
  classroom: string;
  reportSubmitted: boolean;
  internshipCompleted: boolean;
  defenseDegree: number;
  student: User; 
  tutors: Set<User>; 

  constructor(
    idDefense: number,
    defenseDate: string,
    defenseTime: string,
    classroom: string,
    reportSubmitted: boolean,
    internshipCompleted: boolean,
    defenseDegree: number,
    student: User,
    tutors: Set<User>
  ) {
    this.idDefense = idDefense;
    this.defenseDate = defenseDate;
    this.defenseTime = defenseTime;
    this.classroom = classroom;
    this.reportSubmitted = reportSubmitted;
    this.internshipCompleted = internshipCompleted;
    this.defenseDegree = defenseDegree;
    this.student = student;
    this.tutors = tutors;
  }
}
