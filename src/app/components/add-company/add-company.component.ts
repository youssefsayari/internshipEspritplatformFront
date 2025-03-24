import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../Services/CompanyService';
import { Company } from '../../Model/Company';
import { TypeSector } from '../../Model/type-sector.enum';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';


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
  imagePreview: string | ArrayBuffer | null = null;
  selectedFileName: string | null = null;
  @ViewChild('fileInput') fileInput: ElementRef;



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
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.companyForm.patchValue({ image: file });
      this.companyForm.get('image').markAsTouched();
      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.clearImage();
    }
  }

  clearImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedFileName = null;
    this.companyForm.patchValue({ image: null });
    this.companyForm.get('image').markAsTouched();
    
    // Réinitialiser l'input file
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
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
          
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Company added successfully!',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate(['/login']);
          });
        },
        (error) => {
          console.error('Error adding company:', error);
          this.loading = false;
          
          // Check if error is about existing email
          if (error.error && error.error.message && error.error.message.toLowerCase().includes('email')) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'This email is already registered. Please use a different email address.',
              confirmButtonText: 'OK'
            });
          } else {
            // Generic error message for other errors
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'This email is already registered. Please use a different email address.',
              confirmButtonText: 'OK'
            });
          }
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Form',
        text: 'Please fill all required fields and select a logo.',
        confirmButtonText: 'OK'
      });
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