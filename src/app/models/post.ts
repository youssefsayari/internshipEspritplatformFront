import {Skill} from "./skill";

export class Post {
  id!: number;
  title!: string;
  content!: string;
  createdAt!: Date;
  companyName!: string;
  typeInternship!: string;
  skills!: Skill[];
}
