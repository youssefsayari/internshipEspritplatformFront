import { User } from './User';
import { Expertise } from './Expertise.model';

export interface UserInfo {
  idUserDetail: number;
  user: User;
  expertises: Expertise[];
}
