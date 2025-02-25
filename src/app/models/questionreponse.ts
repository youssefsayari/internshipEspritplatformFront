import { Quiz } from "./quiz";

export class QuestionReponse {
    idQuestionReponse?: number;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    reponse_correcte: number;
    quiz?: Quiz;
  }
  