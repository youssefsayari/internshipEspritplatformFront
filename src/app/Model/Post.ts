import { Company } from "./Company";
import { Comment } from "./Comment";
import { Rating } from "./Rating";

export interface Post {
  id?: number; // Ajoute le ? pour rendre l'ID optionnel
  title?: string;
  content?: string;
  createdAt?: string; // ISO Date string
  company?: Company;
  comments?: Comment[];
  ratings?: Rating[];

}
