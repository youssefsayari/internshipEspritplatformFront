import { User } from './user';
import { Evaluation } from './evaluation'; // You'll need to create this

export class Defense {
  idDefense: number;
  defenseDate: string;
  defenseTime: string;
  classroom: string;
  reportSubmitted: boolean;
  internshipCompleted: boolean;
  defenseDegree: number;
  student: User;
  tutors: User[];
  evaluations: Evaluation[] = []; // Add this line

  constructor(
    idDefense: number,
    defenseDate: string,
    defenseTime: string,
    classroom: string,
    reportSubmitted: boolean,
    internshipCompleted: boolean,
    defenseDegree: number,
    student: User,
    tutors: User[],
    evaluations?: Evaluation[] // Add this optional parameter
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
    this.evaluations = evaluations || []; // Initialize evaluations
  }

  validate(): void {
    if (!this.tutors || this.tutors.length !== 3) {
      throw new Error('A defense must have exactly 3 tutors');
    }
    if (!this.internshipCompleted) {
      throw new Error('Cannot schedule defense for incomplete internship');
    }
  }
}