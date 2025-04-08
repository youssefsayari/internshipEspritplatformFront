import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AgreementService} from "../../Services/agreement.service";
import {UserService} from "../../Services/user.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {
  today: string;
  agreementForm!: FormGroup;

  hasInternship: boolean = false;
  checkFinished: boolean = false;
  isFifthYearStudent: boolean = false;

  constructor(private router: Router, private agreementService: AgreementService ,private userService: UserService,private fb: FormBuilder) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.agreementForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      startDate: ['', [Validators.required, this.notBeforeToday()]],
      endDate: ['', [Validators.required, this.endDateAfterStartDate()]],
      companyAddress: ['', [Validators.required]],
      companyPhone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      companyRep: ['', [Validators.required]]
    });


    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('Token');
    const userClasse = localStorage.getItem('userClasse');

    if (!token || !userRole) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }

    this.userService.decodeTokenRole(token).subscribe({
      next: (userDetails) => {
        if (userDetails.id) {
          const userId = userDetails.id;
          const userEmail = userDetails.email;
          console.log('Form is invalid', userEmail);
          this.agreementForm.patchValue({
            email: userEmail,
            startDate: this.today
          });
          if (userRole === 'Student') {
            if (userClasse && userClasse.charAt(0) === '5') {
              this.isFifthYearStudent = true;
              this.agreementService.hasApprovedInternship(+userId).subscribe({
                next: (result) => {
                  this.hasInternship = result;
                  this.checkFinished = true;
                },
                error: (err) => {
                  console.error("Erreur lors de la vérification du stage :", err);
                  this.checkFinished = true;
                }
              });
            } else {
              this.isFifthYearStudent = false;
              this.checkFinished = true;
            }
          }
        }
      },
      error: (err) => {
        console.error("Erreur lors du décodage du token :", err);
        this.checkFinished = true;
      }
    });
  }

  notBeforeToday() {
    return (control) => {
      const today = new Date();
      const inputDate = new Date(control.value);
      if (inputDate < today) {
        return { 'dateBeforeToday': true };
      }
      return null;
    };
  }

  endDateAfterStartDate() {
    return (control) => {
      const startDate = this.agreementForm?.get('startDate')?.value;
      const endDate = control.value;
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (end < start) {
          return { 'endDateBeforeStartDate': true };
        }
      }
      return null;
    };
  }

  onSubmit() {
    if (this.agreementForm.valid) {
      console.log('Form Submitted!', this.agreementForm.value);
    } else {
      console.log('Form is invalid');
    }
  }


}
