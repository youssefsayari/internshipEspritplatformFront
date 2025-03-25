import { Component, HostListener, OnInit, ViewEncapsulation, HostBinding } from '@angular/core';  // Import ViewEncapsulation from @angular/core
import {trigger,state,style,animate,transition,} from '@angular/animations';
import {UserService} from '../../Services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';
import { Router } from '@angular/router'; // Importez Router
import { CompanyService } from '../../Services/CompanyService'; // Assure-toi que le chemin est correct







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
  isUserInCompany: boolean = false; // Variable pour savoir si l'utilisateur appartient à une entreprise
  companyId: number =0; // Déclare une variable pour stocker l'ID de l'entreprise



/*end User Connected Vars*/
  /* Profile Card Vars */
  image: string | undefined;
  from: string | undefined;
  showProfileCard: boolean = false;  // Nouvelle variable pour contrôler l'affichage du profile card

  constructor(private userService: UserService, private router: Router,private companyService: CompanyService) {}

  ngOnInit(): void {
    this.fetchUserDetails().then(() => {
      if (this.userConnecte !== null) {
        this.getUserById(this.userConnecte);
        this.checkUserCompany();
      }
    }).catch((error) => {
      console.error('Error fetching user details:', error);
    });
  }
  checkUserCompany(): void {
    if (!this.userConnecte) {
        console.error('userConnecte est null, impossible de vérifier l\'entreprise');
        return;
    }

    this.companyService.isUserInCompany(this.userConnecte).subscribe(
        (isInCompany: boolean) => {
            this.isUserInCompany = isInCompany;
            if (isInCompany) {
                this.companyService.getCompanyIdByUserId(this.userConnecte).subscribe(
                    (companyId: number) => {
                        this.companyId = companyId;
                    },
                    error => {
                        console.error('Erreur lors de la récupération de l\'ID de l\'entreprise :', error);
                    }
                );
            } else {
                console.log("L'utilisateur n'appartient à aucune entreprise.");
            }
        },
        error => {
            console.error('Erreur lors de la vérification de l\'appartenance à une entreprise :', error);
        }
    );
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
