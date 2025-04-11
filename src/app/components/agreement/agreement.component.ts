import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AgreementService} from "../../Services/agreement.service";
import {UserService} from "../../Services/user.service";
import Swal from 'sweetalert2';
import {InternshipDetailsDTO} from "../../models/internship-details-dto";
import {AgreementRequestDTO} from "../../models/agreement-request-dto";
import {AgreementDTO} from "../../models/agreement-dto";
import {AgreementRemark} from "../../models/agreement-remark";
import {AgreementRemarkService} from "../../Services/agreement-remark.service";

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AgreementComponent implements OnInit {
  today: string;
  agreementForm!: FormGroup;
  internships: InternshipDetailsDTO[] = [];
  selectedInternship!: InternshipDetailsDTO;
  hasInternship: boolean = false;
  checkFinished: boolean = false;
  isFifthYearStudent: boolean = false;
  userId!:number;
  agreementInfo: AgreementDTO;
  hasExistingAgreement: boolean = false;
  AgreementApproved: boolean = false;
  rejectionRemarks?: AgreementRemark[];



  constructor(private router: Router, private agreementService: AgreementService ,private userService: UserService,private fb: FormBuilder,
               private agreementRemarkService: AgreementRemarkService) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.agreementForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      startDate: ['', [Validators.required, this.notBeforeToday()]],
      endDate: ['', [Validators.required, this.endDateAfterStartDate()]],
      companyAddress: ['', [Validators.required]],
      companyPhone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      companyRep: ['', [Validators.required]],
      internship: ['', [Validators.required]]
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
          this.userId = userDetails.id;
          const userEmail = userDetails.email;
          this.agreementForm.patchValue({
            email: userEmail,
            startDate: this.today
          });
          this.agreementService.getAgreementByStudentId(this.userId).subscribe({
            next: (agreement) => {
              this.agreementInfo = agreement;
              this.hasExistingAgreement = true;
              if (agreement.agreementState === 'APPROVED') {
                this.AgreementApproved = true;
              }
              if (agreement.agreementState === 'REJECTED') {
                this.hasExistingAgreement = false;
                this.agreementRemarkService.getAgreementRemarksByAgreementId(agreement.id).subscribe({
                  next: (remarks) => {
                    this.rejectionRemarks = remarks;
                    console.log('✔️ Remarks loaded:', this.rejectionRemarks);
                  },
                  error: (err) => {
                    console.error("Erreur lors de la récupération des remarques :", err);
                  }
                });
              }
            },
            error: (err) => {
              if (err.status === 404) {
                this.hasExistingAgreement = false;
              } else {
                console.error("Erreur lors de la récupération de l'accord :", err);
              }
            }
          });
          this.agreementService.getApprovedInternships(+userId).subscribe({
            next: (result) => {
              this.internships = result
            },
            error: (err) => {
              console.error("Erreur lors de la récupération des stages :", err);
              this.checkFinished = true;
            }
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
        this.router.navigate(['/login']);
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


  onInternshipChange() {
    if (this.selectedInternship) {

      this.agreementForm.patchValue({
        companyAddress: this.selectedInternship.companyAddress || '',
        companyRep: this.selectedInternship.companyRepresentativeFullName || '',
        companyPhone: this.selectedInternship.componyPhone || ''
      });
    } else {
      console.error('No internship selected');
    }
  }


  onSubmit(): void {
    if (this.agreementForm.valid) {
      const agreementRequest: AgreementRequestDTO = {
        studentId: this.userId,
        companyId: this.selectedInternship ? this.selectedInternship.companyId : 0,
        startDate: this.agreementForm.value.startDate,
        endDate: this.agreementForm.value.endDate,
        postId: this.selectedInternship ? this.selectedInternship.postId : 0,
      };

      this.agreementService.addAgreement(agreementRequest).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Succès!',
            text: 'Agreement submitted successfully.',
            confirmButtonText: 'OK'
          });
          console.log('Agreement submitted successfully:', response);
          this.ngOnInit();
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur!',
            text: 'Une erreur est survenue lors de l\'enregistrement de l\'accord.',
            confirmButtonText: 'OK'
          });
          console.error('Error submitting agreement:', err);
        }
      });
    } else {
      console.error('Form is invalid');
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide!',
        text: 'Veuillez vérifier les informations avant de soumettre.',
        confirmButtonText: 'OK'
      });
    }
  }

  downloadAgreement(): void {
    const agreementId = this.agreementInfo.id;

    this.agreementService.downloadAgreementPDF(agreementId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Convention_Stage_${agreementId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        Swal.fire({
          icon: 'success',
          title: 'Download Successful',
          text: 'The PDF file has been successfully downloaded to your machine.',
        });
      },
      error: (err) => {
        console.error('Error downloading the PDF:', err);
        Swal.fire({
          icon: 'error',
          title: 'Download Failed',
          text: 'Unable to download the PDF. Please try again later.',
        });
      }
    });

}



}
