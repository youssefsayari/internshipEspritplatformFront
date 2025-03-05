import { Post } from "./Post";
import { User } from "./User"; // Assurez-vous d'avoir cette interface

export interface Comment {
  id?: number;
  content?: string;
  post?: Post; // Le commentaire peut être lié à un post (optionnel)
  parentComment?: Comment; // Un commentaire peut avoir un commentaire parent (optionnel)
  replies?: Comment[]; // Les réponses peuvent être absentes (optionnel)
  createdAt?: string; // Date de création au format ISO
  user?: User; // Utilisateur qui a écrit le commentaire
}
