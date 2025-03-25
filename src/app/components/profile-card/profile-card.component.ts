import { Component, Input, Output, EventEmitter,OnChanges,SimpleChanges } from '@angular/core';
import { CompanyService } from '../../Services/CompanyService';
import { Company } from '../../Model/Company';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Component({
  selector: 'app-profile-card',
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.css']

})
export class ProfileCardComponent implements OnChanges{
  @Input() companyIdSelected: number;  // Image de l'utilisateur
  @Output() closeCard = new EventEmitter<void>(); // Événement pour fermer la carte
  company: Company;
  isLoading = true;
  error: string | null = null;


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
        this.isLoading = false;
      });
  }
  closeProfileCard() {
    this.closeCard.emit();
  }
}
