import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../Services/CompanyService';
import { Company } from '../../Model/Company';
import { TypeSector } from '../../Model/type-sector.enum';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';


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
  showSecretKey = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  // AI Assistant properties
  showAssistant = false;
  isThinking = false;
  isTyping = false;
  assistantMessage = '';
  showGuessButton = false;
  private typingTimeout: any;
  thankYouMode = false;


  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private router: Router,
    private sanitizer: DomSanitizer
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
      image: ['', Validators.required],
      numEmployees: ['', [Validators.required, Validators.min(1)]]

    });
  }

  ngOnInit(): void {}
  toggleSecretKeyVisibility(): void {
    this.showSecretKey = !this.showSecretKey;
  }
  showThinkingBot() {
  this.showAssistant = true;
  this.isThinking = true;
  this.assistantMessage = 'Analyzing company information...';
  
  // Augmenter le délai à 3 secondes (3000ms)
  setTimeout(() => {
    this.isThinking = false;
    this.assistantMessage = 'I found some information! I can help you complete this form faster.';
    this.showGuessButton = true;
  }, 4000);
}
  checkForAutoComplete() {
    const name = this.companyForm.get('name');
    const website = this.companyForm.get('website');
    
    const shouldShow = name?.valid && 
                     website?.valid && 
                     name?.value && 
                     website?.value &&
                     !(name?.invalid && name?.touched) &&
                     !(website?.invalid && website?.touched);
    
    if (shouldShow && !this.showAssistant) {
      this.showThinkingBot();
    } else if (!shouldShow && this.showAssistant) {
      this.hideAssistant();
    }
  }
  guessForm() {
    this.showGuessButton = false;
    this.isTyping = true;
    this.assistantMessage = 'Great! I\'m fetching the company details...';
    
    const name = this.companyForm.get('name')?.value;
    const website = this.companyForm.get('website')?.value;
    
    this.companyService.enrichCompanyData(name, website).subscribe({
      next: (company) => {
        if (company) {
          this.fillFormWithCompanyData(company);
        } else {
          this.assistantMessage = 'I couldn\'t find enough information. Please complete the form manually.';
          this.isTyping = false;
          setTimeout(() => this.hideAssistant(), 3000);
        }
      },
      error: (error) => {
        console.error('Error enriching company data:', error);
        this.assistantMessage = 'There was an error fetching the data. Please complete the form manually.';
        this.isTyping = false;
        setTimeout(() => this.hideAssistant(), 3000);
      }
    });
  }
  fillFormWithCompanyData(company: any) {
    this.assistantMessage = 'Filling the form with available information...';
    
    const fieldsToFill = [
    { name: 'abbreviation', value: company.abbreviation },
    { name: 'sector', value: company.sector },
    { name: 'email', value: company.email },
    { name: 'phone', value: company.phone?.toString() || '' },
    { name: 'address', value: company.address },
    { name: 'founders', value: company.founders },
    { name: 'foundingYear', value: this.formatDateForInput(company.foundingYear) },
    { name: 'numEmployees', value: company.numEmployees?.toString() || '10' }, // Ensure it's a string
    { name: 'labelDate', value: this.formatDateForInput(company.labelDate) },
    { name: 'secretKey', value: company.secretKey }
  ];
  
    let promises: Promise<void>[] = [];
    
     fieldsToFill.forEach((field, index) => {
    const promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        if (field.name === 'numEmployees') {
          // Special handling for numeric fields
          this.companyForm.get(field.name)?.setValue(parseInt(field.value, 10));
          this.companyForm.get(field.name)?.updateValueAndValidity();
          this.companyForm.get(field.name)?.markAsTouched();
          resolve();
        } else {
          this.typeField(field.name, field.value).then(resolve);
        }
      }, 1000 + (index * 1500));
    });
    promises.push(promise);
  });
  
    Promise.all(promises).then(() => {
      // Vérifier toutes les erreurs après remplissage
      this.showFieldErrors();
      this.assistantMessage = `
      <div class="assistant-message">
        <div class="header">
          <h3>Your Company Profile Is Ready!</h3>
        </div>
        
        <p>I've tried my best to collect available information from public sources.</p>
        
        <div class="welcome-box">
          <span class="welcome-icon">👋</span>
          <span>Welcome to <strong>InnoExpert InternConnect</strong></span>
          <p class="subtext">Your gateway to connecting with top student talent</p>
        </div>
        
        <div class="features">
          <div class="feature-item">
            <span class="feature-icon">•</span>
            <span>Post PFE/Summer internships</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">•</span>
            <span>Screen candidates via smart quizzes</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">•</span>
            <span>Track intern progress in real-time</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">•</span>
            <span>...</span>
          </div>
        </div>
        <br>
         <div class="warning-box">
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">Don't forget to review your details before submitting!</span>
          </div>
      </div>
      `;
      this.showThankYouButton();
    });
  }
  // Méthode pour sécuriser le HTML
getSafeHtml(content: string) {
  return this.sanitizer.bypassSecurityTrustHtml(content);
}
  showThankYouButton() {
    this.showGuessButton = false;
    this.thankYouMode = true;
  }
  hideAssistantAfterThankYou() {
    this.hideAssistant();
    this.thankYouMode = false;
  }


// Helper function to format date for input field
private formatDateForInput(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}
private hideAssistant() {
  this.showAssistant = false;
  this.isThinking = false;
  this.isTyping = false;
  this.assistantMessage = '';
  this.showGuessButton = false;
}

typeField(fieldName: string, value: any): Promise<void> {
  return new Promise((resolve) => {
    this.isTyping = true;
    this.assistantMessage = `Filling ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}...`;
    
  // Skip typing animation for numeric fields
    if (fieldName === 'numEmployees') {
      this.companyForm.get(fieldName)?.setValue(parseInt(value, 10));
      this.companyForm.get(fieldName)?.updateValueAndValidity();
      this.companyForm.get(fieldName)?.markAsTouched();
      this.isTyping = false;
      resolve();
      return;
    }

    let currentValue = '';
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < value.length) {
        currentValue += value.charAt(i);
        this.companyForm.get(fieldName)?.setValue(currentValue, { emitEvent: false });
        i++;
      } else {
        clearInterval(typingInterval);
        // Déclencher manuellement la validation après le remplissage
        this.companyForm.get(fieldName)?.updateValueAndValidity();
        this.companyForm.get(fieldName)?.markAsTouched();
        this.isTyping = false;
        resolve();
      }
    }, 50);
  });
}
showFieldErrors(): void {
  Object.keys(this.companyForm.controls).forEach(key => {
    const control = this.companyForm.get(key);
    if (control?.invalid) {
      control.markAsTouched();
    }
  });
}

  shouldShowAssistant(): boolean {
    const name = this.companyForm.get('name');
    const website = this.companyForm.get('website');
    
    return this.showAssistant && 
           name?.valid && 
           website?.valid && 
           name?.value && 
           website?.value &&
           !(name?.invalid && name?.touched) &&
           !(website?.invalid && website?.touched);
  }

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
            title: 'Setup Complete!',
            html: `
              <div class="success-message">
                <h3>🎉 Welcome to Innoxpert!</h3>
                <p>Your company profile has been successfully Created !.</p>
                <div class="email-notice">
                  <i class="fa fa-envelope-open-o"></i>
                  <p>Please check <strong>${company.email}</strong> for your login credentials and next steps.</p>
                </div>
              </div>
            `,
            confirmButtonText: 'Go to Login Page',
            customClass: {
              popup: 'success-popup'
            }
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