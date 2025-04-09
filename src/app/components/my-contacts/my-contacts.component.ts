import { Component,OnInit,Output,EventEmitter, ViewChild, Input, SimpleChanges} from '@angular/core';
import { CompanyService } from '../../Services/CompanyService';
import {UserService} from '../../Services/user.service';
import { User } from '../../Model/User';
import { Company } from '../../Model/Company';

import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';



@Component({
  selector: 'app-my-contacts',
  templateUrl: './my-contacts.component.html',
  styleUrls: ['./my-contacts.component.css'],
  animations: [
    trigger('listItem', [
      transition(':enter', [
        style({ opacity: 0, height: '0', transform: 'translateY(-20px)' }),
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ opacity: 1, height: '*', transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms cubic-bezier(0.4, 0.0, 0.2, 1)', 
          style({ opacity: 0, height: '0', transform: 'translateY(-20px)' }))
      ])
    ])
  ]

})
export class MyContactsComponent implements OnInit{
    @Output() profileSelected = new EventEmitter<{ userConnecte:number,companyIdSelected:number,companyIdConnected:number }>();
    @Input() followEvent: {companyId: number, isFollowing: boolean};
    private previousFollowEvent: {companyId: number, isFollowing: boolean};

  

  userConnecte: number= 0;
  userType: string = null;
  isUserInCompany = false;
  companyId: number = 0;
  
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
  private imageMap: Map<number, string> = new Map(); // Pour stocker les images associées aux utilisateurs


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

  ngOnChanges(changes: SimpleChanges) {
    if (changes.followEvent && this.followEvent && 
        (!this.previousFollowEvent || 
         this.followEvent.companyId !== this.previousFollowEvent.companyId || 
         this.followEvent.isFollowing !== this.previousFollowEvent.isFollowing)) {
      
      this.handleFollowChange(this.followEvent);
      this.previousFollowEvent = {...this.followEvent};
    }
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
        randomImage: this.getRandomDefaultImage(follower.idUser)
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

// Modifiez la méthode getRandomDefaultImage
getRandomDefaultImage(userId: number): string {
  // Si l'image est déjà mappée pour cet utilisateur, la retourner
  if (this.imageMap.has(userId)) {
    return this.imageMap.get(userId);
  }

  // Si toutes les images ont été utilisées, réinitialiser la liste
  if (this.usedImages.length === this.defaultImages.length) {
    this.usedImages = [];
  }

  // Filtrer les images non encore utilisées
  const availableImages = this.defaultImages.filter(
    img => !this.usedImages.includes(img)
  );

  // Choisir une image aléatoire
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  const selectedImage = availableImages[randomIndex];

  // Stocker l'association user-image
  this.imageMap.set(userId, selectedImage);
  this.usedImages.push(selectedImage);

  return selectedImage;
}

trackByFn(index: number, item: User): number {
  return item.idUser;
}
  // Clic sur l'image ou le nom de l'utilisateur
  onProfileClick(company: Company) {
    this.profileSelected.emit({
      companyIdConnected : this.companyId,
      userConnecte : this.userConnecte,
     companyIdSelected: company.id
    });
  }


private handleFollowChange(event: {companyId: number, isFollowing: boolean}): void {
  if (this.isUserInCompany) {
    this.loadFollowers(); // Recharger si c'est une entreprise
  } else {
    // Mise à jour optimisée pour les utilisateurs normaux
    if (event.isFollowing) {
      // Ajout immédiat avec optimiste UI update
      this.companyService.getCompanyById(event.companyId).subscribe({
        next: (company) => {
          if (!this.followedCompanies.some(c => c.id === company.id)) {
            this.followedCompanies = [company, ...this.followedCompanies];
          }
        },
        error: () => {
          // Fallback si l'optimistic update échoue
          this.loadFollowedCompanies();
        }
      });
    } else {
      // Suppression immédiate avec optimiste UI update
      this.followedCompanies = this.followedCompanies.filter(c => c.id !== event.companyId);
    }
  }
}



}




