export interface UserRec {
    idUser?: number;
  firstName?: string;
  lastName?: string;
  identifiant?: string;
  email?: string;
  password?: string;
  telephone?: number;
  classe?: string;
  quiz?: string;
  OTP?: number;
  typeUser?: 'ADMIN' | 'USER';
  role?: string;
  id?: number; // facultatif si nécessaire
}
