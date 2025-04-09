export interface TimeLine {
  id: number;
  title: string;
  description: string;
  dateLimite: string; // ISO format
  studentId: number;
  documentId: number | null;
}
