import { Injectable } from '@angular/core';
import { UserRec } from '../models/user-rec';
import { UserService } from '../Services/user.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private currentUser: UserRec | null = null;

  constructor(private userService: UserService) {}

  fetchUserDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('Token');
      if (!token) return reject('Token non trouvé');

      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          localStorage.setItem('userRole', userDetails.role);
          localStorage.setItem('userClasse', userDetails.classe);

          const mappedRole = this.mapRole(userDetails.role);

          // Crée un utilisateur à partir du token décodé
          this.currentUser = {
            idUser: userDetails.id,
            firstName: userDetails.firstName || '',
            lastName: userDetails.lastName || '',
            email: userDetails.email || '',
            typeUser: mappedRole,
            password: '',
            id: 0
          };

          resolve();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: '⚠️ Error',
            text: 'Failed to fetch user details. Please log in again.',
            width: '50%',
            customClass: {
              popup: 'swal-custom-popup',
              confirmButton: 'swal-custom-button'
            }
          });
          reject(err);
        }
      });
    });
  }

  private mapRole(role: string): 'ADMIN' | 'USER' {
    if (role === 'Admin') return 'ADMIN';
    if (role === 'Student') return 'USER';
    return 'USER';
  }

  getCurrentUser(): UserRec {
    if (!this.currentUser) {
      console.warn('⚠️ currentUser is null. Did you forget to call fetchUserDetails()?');
      return {
        idUser: 0,
        firstName: '',
        lastName: '',
        email: '',
        typeUser: 'USER',
        password: '',
        id: 0
      };
    }
    return this.currentUser;
  }
}
