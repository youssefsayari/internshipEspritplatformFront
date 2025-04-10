export interface TimeLine {
  id: number;
  title: string;
  description: string;
  dateLimite: string;
  timeLaneState: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  studentId: number;
  documentId: number | null;
}
