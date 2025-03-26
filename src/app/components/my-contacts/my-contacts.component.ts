import { Component,OnInit,Output,EventEmitter} from '@angular/core';
import { CompanyService } from '../../Services/CompanyService';
import {UserService} from '../../Services/user.service';
import { User } from '../../Model/User';
import { Company } from '../../Model/Company';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-my-contacts',
  templateUrl: './my-contacts.component.html',
  styleUrls: ['./my-contacts.component.css']

})
export class MyContactsComponent implements OnInit{
    @Output() profileSelected = new EventEmitter<{ userConnecte:number,companyIdSelected:number }>();
  

  userConnecte: number= null;
  userType: string = null;
  isUserInCompany = false;
  companyId: number = null;
  
  followers: User[] = [];
   followedCompanies: Company[] = [];
  isLoading = true;
  error: string | null = null;
  defaultImages = [
    '/assets/images/profile/user-1.jpg',
    '/assets/images/profile/user-2.jpg',
    '/assets/images/profile/user-3.jpg',
    '/assets/images/profile/user-4.jpg'
  ];
  usedImages: string[] = []; // Garde trace des images déjà utilisées

  // Titres dynamiques
  title: string = '';
  subtitle: string = '';
  constructor(private companyService: CompanyService,private userService:UserService) { }

  ngOnInit(): void {
    this.fetchUserDetails().then(() => {
      this.checkUserCompany().then(isCompany => {
        if (isCompany) {
          this.title = 'My Followers';
          this.subtitle = 'Checkout companies following me';
          this.loadFollowers();
        } else {
          this.title = 'Followed Companies';
          this.subtitle = 'Companies I follow';
          this.loadFollowedCompanies();
        }
      });
    }).catch(err => {
      console.error('Error initializing component:', err);
      this.isLoading = false;
      this.error = 'Failed to initialize component';
    });
  }

  fetchUserDetails(): Promise<void> {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem('Token');
        if (!token) return reject('Token non trouvé');
  
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
                        confirmButton: 'swal-custom-button'
                    }
                });
                reject(err);
            }
        });
    });
  }
  checkUserCompany(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        if (!this.userConnecte) {
            console.error('userConnecte est null, impossible de vérifier l\'entreprise');
            return resolve(false);
        }

        this.companyService.isUserInCompany(this.userConnecte).subscribe(
            (isInCompany: boolean) => {
                this.isUserInCompany = isInCompany;
                if (isInCompany) {
                    this.companyService.getCompanyIdByUserId(this.userConnecte).subscribe(
                        (companyId: number) => {
                            this.companyId = companyId;
                            resolve(true);
                        },
                        error => {
                            console.error('Erreur lors de la récupération de l\'ID de l\'entreprise :', error);
                            reject(error);
                        }
                    );
                } else {
                    console.log("L'utilisateur n'appartient à aucune entreprise.");
                    resolve(false);
                }
            },
            error => {
                console.error('Erreur lors de la vérification de l\'appartenance à une entreprise :', error);
                reject(error);
            }
        );
    });
}


loadFollowers(): void {
  if (!this.companyId) {
    this.error = 'Company ID not available';
    this.isLoading = false;
    return;
  }

  this.isLoading = true;
  this.companyService.getCompanyFollowers(this.companyId).subscribe({
    next: (followers) => {
      this.followers = followers.map(follower => ({
        ...follower,
        randomImage: this.getRandomDefaultImage()
      }));
      this.isLoading = false;
    },
    error: (err) => {
      this.error = 'Failed to load followers';
      this.isLoading = false;
      console.error(err);
    }
  });
}

loadFollowedCompanies(): void {
  if (!this.userConnecte) {
    this.error = 'User ID not available';
    this.isLoading = false;
    return;
  }

  this.isLoading = true;
  this.companyService.getCompaniesFollowedByUser(this.userConnecte).subscribe({
    next: (companies) => {
      this.followedCompanies = companies;
      this.isLoading = false;
    },
    error: (err) => {
      this.error = 'Failed to load followed companies';
      this.isLoading = false;
      console.error(err);
    }
  });
}

getRandomDefaultImage(): string {
  // Si toutes les images ont été utilisées, réinitialise la liste
  if (this.usedImages.length === this.defaultImages.length) {
    this.usedImages = [];
  }

  // Filtre les images non encore utilisées
  const availableImages = this.defaultImages.filter(
    img => !this.usedImages.includes(img)
  );

  // Choisit une image aléatoire parmi celles disponibles
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImage = availableImages[randomIndex];

  // Ajoute l'image sélectionnée aux images utilisées
  this.usedImages.push(selectedImage);

  return selectedImage;
}

trackByFn(index: number, item: User): number {
  return item.idUser;
}
  // Clic sur l'image ou le nom de l'utilisateur
  onProfileClick(company: Company) {
    this.profileSelected.emit({
      userConnecte : this.userConnecte,
     companyIdSelected: company.id
    });
  }

}


