import { Post } from "./Post";
import { User } from "./User";

export interface Company {
  id: number;
  name: string;
  abbreviation?: string;
  address?: string;
  sector: "TECHNOLOGY" | "FINANCE" | "HEALTHCARE" | "EDUCATION";
  email: string;
  phone?: number;
  foundingYear?: string; // ISO Date string
  labelDate?: string; // ISO Date string
  website?: string;
  founders?: string;
  secretKey: string;
  posts: Post[];
  owner: User;
  followers: User[];
}
