import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConsultantService } from '../../Services/consultant.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-consultant',
  templateUrl: './edit-consultant.component.html',
  styleUrls: ['./edit-consultant.component.scss']
})
export class EditConsultantComponent implements OnInit {
  consultant: any = {
    fullName: '',
    email: '',
    specialty: '',
    profileDescription: ''
  };

  originalEmail: string = '';
  emailTaken: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private consultantService: ConsultantService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const consultantId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(consultantId);
    if (consultantId) {
      this.consultantService.getConsultantById(consultantId).subscribe({
        next: (data) => {
          this.consultant = data;
          this.originalEmail = data.email; // Save original for comparison
        },
        error: () => {
          this.toastr.error('Failed to load consultant');
          this.router.navigate(['/consultant-list']);
        }
      });
    }
  }

  validateEmail() {
    if (this.consultant.email && this.consultant.email !== this.originalEmail) {
      this.consultantService.checkEmailExists(this.consultant.email).subscribe({
        next: (exists) => {
          this.emailTaken = exists;
        },
        error: () => {
          this.emailTaken = false;
        }
      });
    } else {
      this.emailTaken = false;
    }
  }

  onUpdate() {
    this.consultantService.updateConsultant(this.consultant.id, this.consultant).subscribe({
      next: () => {
        this.toastr.success('Consultant updated successfully!');
        this.router.navigate(['/consultant-list']);
      },
      error: () => {
        this.toastr.error('Failed to update consultant');
      }
    });
  }
}
