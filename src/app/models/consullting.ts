export interface Consultant {
    id?: number;
    email: string;
    name?: string;
    specialty?: string;
    profileDescription?: string;
  }
  
  export interface Client {
    id?: number;
    fullName: string;
    email: string;
  }
  
  export interface Consultation {
    id?: number;
    clientId: number;
    client:any;
    startTime: string;
    endTime: string;
    specialty: string;
    meetingLink: string;
    slot:any;
    consultant:any;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  }
  export enum ConsultationStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
  }