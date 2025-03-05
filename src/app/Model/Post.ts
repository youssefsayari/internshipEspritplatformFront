import { Company } from "./Company";
import { Comment } from "./Comment";
import { Rating } from "./Rating";
import {Skill} from "../models/skill";

export interface Post {
  id?: number; // Ajoute le ? pour rendre l'ID optionnel
  title?: string;
  content?: string;
  createdAt?: string; // ISO Date string
  company?: Company;
  comments?: Comment[];
  ratings?: Rating[];
  companyName?: string;
  typeInternship?: string;
  skills?: Skill[];
  expiryDateTime?: string; // ISO Date string (nullable)
}
