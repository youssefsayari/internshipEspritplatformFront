import { Post } from "./Post";
import { Comment } from "./Comment";
import { User } from "./User";

export interface Rating {
  id?: number;
  stars?: number;
  post?: Post;
  user?: User;
  createdAt?: string; // ISO Date string
}
