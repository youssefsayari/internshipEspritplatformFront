
import {Societe} from "./societe"
import { QuestionReponse} from "./questionreponse";

export class Quiz {
    idQuiz?: number;
    titre: string;
    description: string;
    date_passage: Date;
    societe?: Societe; // Remplace 'any' par le type correct si nécessaire
    questions?: QuestionReponse[];
  }
  