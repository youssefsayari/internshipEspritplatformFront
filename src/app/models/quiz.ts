
import {Societe} from "./societe"
import { QuestionReponse} from "./questionreponse";

export class Quiz {
    idQuiz?: number;
    titre: string;
    description: string;
    date_passage: Date;
    societe?: Societe; 
    questions?: QuestionReponse[];
  }
  