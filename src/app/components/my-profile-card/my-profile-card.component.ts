import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CompanyService } from '../../Services/CompanyService';
import { Company } from '../../Model/Company';
import {UserService} from '../../Services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';




@Component({
  selector: 'app-my-profile-card',
  templateUrl: './my-profile-card.component.html',
  styleUrls: ['./my-profile-card.component.scss']
})

export class MyProfileCardComponent implements OnInit {
  company: Company;
  formattedCompany: any; // Nouvelle propriété pour les données formatées
  isLoading = true;
  error: string = null;
  userType: string;
  userConnecte: number;
  isUserInCompany: boolean = false;
  companyId: number = 0;
  isEditing = false;
originalCompany: Company;
updatedCompany: any;
isSaving = false;


  constructor( private companyService: CompanyService, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUserDetails().then(() => {
      this.checkUserCompany();
      this.loadCompanyData();
      
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
loadCompanyData(): void {
  this.companyService.getCompanyByUserId(this.userConnecte).subscribe({
    next: (response: Company) => {
      this.company = response;
      this.formatCompanyData(response);
      this.isLoading = false;
    },
    error: (err) => {
      this.error = 'Failed to load company data';
      this.isLoading = false;
      console.error('Error loading company:', err);
    }
  });
}

formatCompanyData(company: Company): void {
  this.formattedCompany = {
    ...company,
    // Formater les dates sans modifier le modèle original
    foundingYear: company.foundingYear ? new Date(company.foundingYear).getFullYear() : 'N/A',
    labelDate: company.labelDate ? new Date(company.labelDate).getFullYear() : 'N/A',
    // Image par défaut
    image: company.image || {
      imageUrl: 'assets/images/profile/user-1.jpg',
      name: 'default'
    },
    // Formater le secteur
    sectorDisplay: this.getSectorDisplayName(company.sector),
    numEmployees: company.numEmployees || 'N/A' // Ajout du nouveau champ

  };
}

getSectorDisplayName(sector: string): string {
  const sectorNames = {
    'TECHNOLOGY': 'Technology',
    'FINANCE': 'Finance', 
    'HEALTHCARE': 'Healthcare',
    'EDUCATION': 'Education',
    'OTHER': 'Other'

  };
  return sectorNames[sector] || sector;
}
// Modifiez ou ajoutez ces méthodes
toggleEditMode(): void {
  this.isEditing = !this.isEditing;
  
  if (this.isEditing) {
    // Sauvegarder l'original avant modification
    this.originalCompany = {...this.company};
    this.updatedCompany = {...this.formattedCompany};
  } else {
    // Annuler les modifications
    this.formatCompanyData(this.originalCompany);
  }
}

saveChanges(): void {
  this.isSaving = true;
  
  // Convertir les données formatées vers le modèle Company
  // Create the update payload carefully
  const payload = {
    id: this.company.id,
    name: this.updatedCompany.name,
    abbreviation: this.updatedCompany.abbreviation,
    email: this.updatedCompany.email,
    phone: Number(this.updatedCompany.phone), // Ensure it's a number
    address: this.updatedCompany.address,
    website: this.updatedCompany.website,
    founders: this.updatedCompany.founders,
    sector: this.updatedCompany.sector,
    // Send dates as they were originally (don't convert to just years)
    foundingYear: this.company.foundingYear,
    labelDate: this.company.labelDate,
    numEmployees: Number(this.updatedCompany.numEmployees), // Conversion en number

    // Include required fields that might be missing
    secretKey: this.company.secretKey
  };
  console.log('Update payload:', payload); // Debug log



  this.companyService.updateCompany(this.company.id, payload).subscribe({
    next: (updatedCompany) => {
      this.company = updatedCompany;
      this.formatCompanyData(updatedCompany);
      this.isEditing = false;
      this.isSaving = false;
      
      Swal.fire({
        icon: 'success',
        title: 'Update Complete!',
        html: `
          <div class="success-message">
            <h3>🎉 Profile Updated!</h3>
            <p>Your company details have been successfully updated.</p>
            <div class="email-notice">
              <i class="fa fa-envelope-open-o"></i>
              <p>Check <strong>${this.company.email}</strong> for updated credentials</p>
            </div>
          </div>
        `,
        confirmButtonText: 'Continue',
        customClass: {
          popup: 'success-popup'
        },
        timer: 7000
      });
    },
    error: (err) => {
      this.isSaving = false;
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        html: `
          <div class="error-message">
            <h4>⚠️ Update Error</h4>
            <p>${err.message || 'Failed to update profile'}</p>
            <div class="retry-box">
              <i class="fas fa-sync-alt"></i>
              <p>Please check your inputs and try again</p>
            </div>
          </div>
        `
      });
    }
  });
}
deleteCompany(): void {
  Swal.fire({
    title: 'Confirmer la suppression',
    text: 'Êtes-vous sûr de vouloir supprimer définitivement cette entreprise ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ff416c',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.companyService.deleteCompany(this.companyId).subscribe({
        next: (response) => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Entreprise supprimée !',
              text: response.message || 'Votre entreprise a été supprimée avec succès',
              timer: 2000,
              showConfirmButton: false
            }).then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: response.message || 'La suppression a échoué'
            });
          }
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: err.message || 'Une erreur inattendue est survenue lors de la suppression'
          });
        }
      });
    }
  });
}

}
