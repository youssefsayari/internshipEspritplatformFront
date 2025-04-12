import {Skill} from "./skill";

export class InternshipTutorResponse {
  idInternship!: number;
  studentName!: string;
  classe!: string;
  internshipState!: string;
  typeInternship!: string;
  title!: string;
  content!: string;
  companyName!: string;
  skills!: Skill[];
  studentId!: number;
  isValidator!: boolean;
}
