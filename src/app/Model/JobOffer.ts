export interface JobOffer {
  id?: number;
  title: string;
  description: string;
  location: string;
  salary: number;
  jobType: string;
  publishDate: string;
  deadline: string;
  remote: boolean;
  requiredSkills: string[];
  company?: any;
}