import { Component, HostListener, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';  // Import ViewEncapsulation from @angular/core
import {trigger,state,style,animate,transition,} from '@angular/animations';
import {UserService} from '../../Services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import { Router } from '@angular/router'; // Importez Router






@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css'],
  encapsulation: ViewEncapsulation.None,  // Use the enum correctly

  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0, transform: 'translateX(-20px)' })),
      transition(':enter, :leave', [
        animate('0.4s ease', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class IconsComponent implements OnInit {
  @HostBinding('@fadeInOut') get fadeInOut() {
    return true;
  }
/*User Connected Vars*/
  userType: string | null = '';
  userConnecte: number | null = 0;
  user: User |undefined; // Initialisation de user

/*end User Connected Vars*/
  /* Profile Card Vars */
  image: string | undefined;
  from: string | undefined;
  showProfileCard: boolean = false;  // Nouvelle variable pour contrôler l'affichage du profile card

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserDetails().then(() => {
      if (this.userConnecte !== null) {
        this.getUserById(this.userConnecte);
      }
    }).catch((error) => {
      console.error('Error fetching user details:', error);
    });
  }
  // Méthode pour mettre à jour les informations du profil
  onProfileSelected(profileData: any) {
    this.image = profileData.image;
    this.from = profileData.from;
    this.showProfileCard = true;  // Affiche le profile card
    
  }
  onCloseCard() {
    this.showProfileCard = false;
  }
  fetchUserDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('Token');
      if (!token) {
        this.router.navigate(['/login']); // Redirige vers /login si le token est absent
        return reject('Token non trouvé');
      }
  
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          localStorage.setItem('userRole', userDetails.role);
          localStorage.setItem('userClasse', userDetails.classe);
  
          this.userType = userDetails.role;
          this.userConnecte = userDetails.id;
  
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
              confirmButton: 'swal-custom-button',
            },
          });
  
          this.router.navigate(['/login']); // Redirige vers /login en cas d'erreur
          reject(err);
        },
      });
    });
  }
 // Méthode pour récupérer les détails d'un utilisateur par son ID
 getUserById(userId: number): void {
  this.userService.getUserById(userId).subscribe(
    (data: User) => {
      this.user = data;
      console.log('User details:', this.user);
    },
    (error) => {
      console.error('Error fetching user details:', error);
    }
  );
}
}
