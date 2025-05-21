import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../Services/client.service';
import { Client } from '../../models/consullting';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent implements OnInit {
  clientForm!: FormGroup;
  clientId!: number;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();
    this.loadClient();
  }

  initForm() {
    this.clientForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  loadClient() {
    this.clientService.getClientById(this.clientId).subscribe({
      next: (client: Client) => this.clientForm.patchValue(client),
      error: () => this.errorMessage = 'Failed to load client details.'
    });
  }

  onUpdateClient() {
    if (this.clientForm.valid) {
      this.clientService.updateClient(this.clientId, this.clientForm.value).subscribe({
        next: () => {
          this.successMessage = 'Client updated successfully!';
          setTimeout(() => this.router.navigate(['/client-list']), 1500);
        },
        error: () => this.errorMessage = 'Failed to update client. Please try again.'
      });
    } else {
      this.errorMessage = 'Please fix the validation errors before submitting.';
    }
  }
}
