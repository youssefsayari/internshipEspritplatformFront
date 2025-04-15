export type EvaluationStatus = 'PENDING' | 'SUBMITTED';

export interface Evaluation {
    id?: number;
    defenseId: number;
    tutorId: number;
    grade: number;
    remarks: string;
    status: EvaluationStatus;
}