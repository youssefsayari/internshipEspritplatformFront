// ✅ reclamation.model.ts
export interface Reclamation {
  id?: number;
  subject: string;
  description: string;
  status: ReclamationStatus;
  userId: number;
  adminId?: number;
  response?: string;
  createdAt?: string; // ✅ Ajouté pour archive
  updatedAt?: string; // ✅ Ajouté pour archive
}

export enum ReclamationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED'
}
