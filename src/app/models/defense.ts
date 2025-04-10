import { User } from './user';

export class Defense {
  idDefense: number;
  defenseDate: string;  // Matches Java LocalDate serialization
  defenseTime: string;  // Matches Java LocalTime serialization 
  classroom: string;
  reportSubmitted: boolean;
  internshipCompleted: boolean;
  defenseDegree: number;
  student: User;
  tutors: User[];  // Using array instead of Set (TypeScript/JavaScript standard)

  constructor(
    idDefense: number,
    defenseDate: string,
    defenseTime: string,
    classroom: string,
    reportSubmitted: boolean,
    internshipCompleted: boolean,
    defenseDegree: number,
    student: User,
    tutors: User[]
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

  // Validation method matching Java's @PrePersist/@PreUpdate
  validate(): void {
    if (!this.tutors || this.tutors.length !== 3) {
      throw new Error('A defense must have exactly 3 tutors');
    }
    if (!this.internshipCompleted) {
      throw new Error('Cannot schedule defense for incomplete internship');
    }
  }

} 


