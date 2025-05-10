import { Post } from "./Post";
import { User } from "./User";
import { Image } from "./image";

export interface Company {
  id?: number;
  name?: string;
  abbreviation?: string;
  address?: string;
  sector?: "TECHNOLOGY" | "FINANCE" | "HEALTHCARE" | "EDUCATION" | "OTHER";
  email?: string;
  phone?: number;
  foundingYear?: Date; // ISO Date string
  labelDate?: Date; // ISO Date string
  website?: string;
  founders?: string;
  secretKey?: string;
  posts?: Post[];
  owner?: User;
  followers?: User[];
  image?: Image; // Ajoutez ce champ
  numEmployees?: number;

}
export interface CompanyAnalyticsDto {
  id?: number;
  name?: string;
  address?: string;
  sector?: string;
  logoUrl?: string;
  website?: string;
  internshipCount?: number;
  averageRating?: number;
  foundingYear?: Date;
  labelDate?: Date;
  founders?: string;
  email?: string;
  numEmployees?: number;
}
