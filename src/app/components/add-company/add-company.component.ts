import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../Services/CompanyService';
import { Company } from '../../Model/Company';
import { TypeSector } from '../../Model/type-sector.enum';
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {
  companyForm: FormGroup;
  sectors = Object.values(TypeSector);
  loading = false;
  selectedFile: File | null = null;
  currentYear: number = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9 ]+$')]],
      abbreviation: ['', Validators.required],
      address: ['', [Validators.required, Validators.minLength(5)]],
      sector: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.min(10000000), Validators.max(999999999999999)]],
      foundingYear: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      labelDate: ['', [Validators.required, this.validateLabelDate.bind(this)]],
      website: ['', [Validators.required, Validators.pattern('https?://.+')]],
      founders: ['', [Validators.required, Validators.minLength(1)]],
      secretKey: ['', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).{8,}$')]],
      image: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  validateLabelDate(control: any): { [key: string]: boolean } | null {
    const labelDate = new Date(control.value);
    const foundingYear = new Date(this.companyForm?.get('foundingYear')?.value);
    if (labelDate < foundingYear || labelDate > new Date()) {
      return { 'invalidLabelDate': true };
    }
    return null;
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    this.companyForm.patchValue({ image: this.selectedFile });
    this.companyForm.get('image')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.companyForm.valid && this.selectedFile) {
      this.loading = true;
      const company: Company = this.companyForm.value;
      this.companyService.addCompanyAndAssignUser(company, this.selectedFile).subscribe(
        (newCompany) => {
          console.log('Company added successfully:', newCompany);
          this.loading = false;
          this.resetForm();
          
          // Redirect to /login after successful addition
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Error adding company:', error);
          this.loading = false;
        }
      );
    } else {
      console.error('Form is invalid or no file selected');
    }
  }
  resetForm(): void {
    this.companyForm.reset();
    this.selectedFile = null;
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}