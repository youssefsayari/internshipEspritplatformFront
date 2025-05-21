import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultantService } from '../../Services/consultant.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-consultant',
  templateUrl: './add-consultant.component.html',
  styleUrls: ['./add-consultant.component.scss']
})
export class AddConsultantComponent  {

  consultant = {
    fullName: '',
    email: '',
    specialty: '',
    profileDescription: ''
  };
  
  constructor(private consultantService: ConsultantService, private router: Router) {}

  onSave() {
    this.consultantService.createConsultant(this.consultant).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Consultant created successfully.',
          confirmButtonColor: '#28a745'
        }).then(() => {
          this.router.navigate(['/consultant-list']);
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Creation Failed',
          text: 'Failed to create consultant. Please try again.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

}
