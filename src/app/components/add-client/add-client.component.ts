
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../Services/client.service';
import { Client } from '../../models/consullting';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  clientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onAddClient(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;

      this.clientService.registerClient(clientData).subscribe({
        next: (res: any) => {
          console.log('Backend response:', res);
          const clientId = res.id;

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Client successfully registered!',
            confirmButtonColor: '#28a745'
          }).then(() => {
            this.router.navigate(['/consultation-request', clientId]);
          });
        },
        error: (error) => {
          console.error('Error adding client:', error);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'Failed to register client. Try again.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      this.clientForm.markAllAsTouched();
    }
  }
  onSubmitAndNavigate(): void {
    if (this.clientForm.valid) {
      const clientData = this.clientForm.value;

      this.clientService.registerClient(clientData).subscribe({
        next: (res: any) => {
          console.log('Backend response:', res);
          const clientId = res.id;

          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Client successfully registered!',
            confirmButtonColor: '#28a745'
          }).then(() => {
            // Navigate to the other URL
            this.router.navigate(['/ai-recommend' , clientId]);
          });
        },
        error: (error) => {
          console.error('Error adding client:', error);
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: 'Failed to register client. Try again.',
            confirmButtonColor: '#d33'
          });
        }
      });
    } else {
      this.clientForm.markAllAsTouched();
    }
  }
}
