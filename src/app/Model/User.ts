import { UserInfo } from "./User-info.model";

export interface User {
    idUser?: number;
    firstName?: string;
    lastName?: string;
    identifiant?: string;
    password?: string;
    email?: string;
    telephone?: number;
    typeUser?: string;
    userInfo?:UserInfo
    option?: string;
  
  }
