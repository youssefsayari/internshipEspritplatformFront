import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../../Services/CompanyService';
import { Company } from '../../Model/Company';
import {UserService} from '../../Services/user.service';
import Swal from 'sweetalert2';




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


  constructor( private companyService: CompanyService,private userService: UserService) {}

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
    sectorDisplay: this.getSectorDisplayName(company.sector)
  };
}

getSectorDisplayName(sector: string): string {
  const sectorNames = {
    'TECHNOLOGY': 'Technology',
    'FINANCE': 'Finance', 
    'HEALTHCARE': 'Healthcare',
    'EDUCATION': 'Education'
  };
  return sectorNames[sector] || sector;
}

}
