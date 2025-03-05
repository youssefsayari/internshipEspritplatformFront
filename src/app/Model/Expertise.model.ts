export enum TypeExpertise {
    SOFTWARE, 
    HARDWARE,
    NETWORKING
  }
  
  export interface Expertise {
    idExpertise: number;
    typeExpertise: TypeExpertise;
  }
  