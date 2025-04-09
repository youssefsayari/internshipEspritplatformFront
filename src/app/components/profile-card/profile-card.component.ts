import { Component, Input, Output, EventEmitter,OnChanges,SimpleChanges } from '@angular/core';
import { CompanyService } from '../../Services/CompanyService';
import { Company } from '../../Model/Company';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { User } from '../../Model/User'; // Ensure this path is correct


@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']

})
export class ProfileCardComponent implements OnChanges{
  @Input() companyIdSelected: number;  // Image de l'utilisateur
  @Input() userConnecte: number;  // Image de l'utilisateur
  @Input() companyIdConnected: number;  // Image de l'utilisateur

  @Output() followChanged = new EventEmitter<{companyId: number, isFollowing: boolean}>();
  @Output() closeCard = new EventEmitter<void>(); // Événement pour fermer la carte
  company: Company;
  isLoading = true;
  error: string | null = null;
  isFollowing = false;



  constructor(private companyService: CompanyService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['companyIdSelected'] && 
        this.companyIdSelected && 
        (!this.company || this.company.id !== this.companyIdSelected)) {
      this.loadCompany();
    }
  }
 
  loadCompany(): void {
    this.isLoading = true;
    this.error = null;
    
    this.companyService.getCompanyById(this.companyIdSelected)
      .pipe(
        catchError(err => {
          this.error = 'Failed to load company details';
          this.isLoading = false;
          return throwError(err);
        })
      )
      .subscribe(company => {
        this.company = company;
        this.checkFollowingStatus(); // Ajoutez cette ligne
        this.isLoading = false;
      });
  }
  closeProfileCard() {
    this.closeCard.emit();
  }

  checkFollowingStatus(): void {
    if (this.userConnecte && this.company) {
      this.companyService.isFollowingCompany(this.userConnecte, this.company.id)
        .subscribe({
          next: (isFollowing) => {
            this.isFollowing = isFollowing;
          },
          error: (err) => {
            console.error('Error checking follow status:', err);
            this.isFollowing = false;
          }
        });
    }
  }

  toggleFollow(): void {
    if (!this.userConnecte || !this.company) return;
    
    const previousState = this.isFollowing;
    this.isFollowing = !previousState;
    
    const action = previousState 
      ? this.companyService.unfollowCompany(this.userConnecte, this.company.id)
      : this.companyService.followCompany(this.userConnecte, this.company.id);
  
    action.subscribe({
      next: () => {
        this.updateFollowersList(!previousState);
        // Émettre l'événement avec les bonnes données
        this.followChanged.emit({
          companyId: this.company.id,
          isFollowing: !previousState
        });
        this.error = null;
      },
      error: (err) => {
        this.isFollowing = previousState;
        if (!err.message.includes('parsing')) {
          this.error = 'An error occurred';
        }
      }
    });
  }

  updateFollowersList(isFollow: boolean): void {
    // On simule la mise à jour de la liste des followers
    // En réalité, il faudrait recharger les données depuis le serveur
    // pour avoir les données à jour
    if (isFollow) {
      // Simuler l'ajout d'un follower
      this.company.followers = [...(this.company.followers || []), { idUser: this.userConnecte } as User];
    } else {
      // Simuler la suppression d'un follower
      this.company.followers = (this.company.followers || []).filter(f => f.idUser !== this.userConnecte);
    }
  }

}
