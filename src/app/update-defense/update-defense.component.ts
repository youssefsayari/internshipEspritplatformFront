import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DefenseService } from '../Services/defense.service';
import { Defense } from '../models/defense';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-defense',
  templateUrl: './update-defense.component.html',
  styleUrls: ['./update-defense.component.scss'],
  providers: [DatePipe]
})
export class UpdateDefenseComponent implements OnInit {
  defenseForm: FormGroup;
  defense: Defense;
  minTime = '08:00';
  maxTime = '18:00';
  today = new Date().toISOString().split('T')[0];
  isSubmitting = false;
  errorMessage: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private defenseService: DefenseService,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    const id = history.state.defenseId;

if (!id) {
  this.toastr.error('No defense ID found in navigation state.', 'Error');
  this.router.navigate(['/defenses']);
  return;
}
    this.loadDefense(id);
  }

  initializeForm(): void {
    this.defenseForm = this.fb.group({
      defenseDate: ['', [Validators.required, this.futureDateValidator]],
      defenseTime: ['', [
        Validators.required,
        Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),
        this.timeRangeValidator
      ]],
      classroom: ['', [Validators.required, Validators.maxLength(50)]]
    });
  }

  loadDefense(id: number): void {
    this.defenseService.getDefenseById(id).subscribe({
      next: (defense) => {
        this.defense = defense;
        this.patchFormValues();
        this.checkIfEvaluated();
      },
      error: (err) => this.handleError(err)
    });
  }

  patchFormValues(): void {
    if (this.defense) {
      const formattedDate = this.datePipe.transform(this.defense.defenseDate, 'yyyy-MM-dd');
      const formattedTime = this.defense.defenseTime?.substring(0, 5);
      
      this.defenseForm.patchValue({
        defenseDate: formattedDate,
        defenseTime: formattedTime,
        classroom: this.defense.classroom
      });
    }
  }

  futureDateValidator = (control: AbstractControl): {[key: string]: any} | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(control.value);
    return selectedDate < today ? { 'pastDate': true } : null;
  }

  timeRangeValidator = (control: AbstractControl): {[key: string]: any} | null => {
    if (!control.value) return null;
    const time = control.value;
    const [hours, minutes] = time.split(':').map(Number);
    if (hours < 8 || (hours === 8 && minutes < 0) || hours > 18 || (hours === 18 && minutes > 0)) {
      return { 'invalidTime': true };
    }
    return null;
  }

  get f() { return this.defenseForm.controls; }

  checkIfEvaluated(): void {
    if (this.defense?.defenseDegree !== 0) {
      this.errorMessage = 'This defense has already been evaluated and cannot be updated.';
      this.defenseForm.disable();
      this.toastr.warning(this.errorMessage, 'Update Restricted');
    }
  }

  onSubmit(): void {
    if (this.defenseForm.invalid || this.isSubmitting) {
      this.defenseForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    const formValue = this.defenseForm.value;
    const payload = {
      idDefense: this.defense.idDefense,
      defenseDate: this.datePipe.transform(formValue.defenseDate, 'yyyy-MM-dd'),
      defenseTime: formValue.defenseTime ,
      classroom: formValue.classroom,
      // Preserved fields from existing defense
      reportSubmitted: this.defense.reportSubmitted,
      internshipCompleted: this.defense.internshipCompleted,
      defenseDegree: this.defense.defenseDegree,
      student: { idUser: this.defense.student.id },
      tutors: this.defense.tutors.map(t => ({ idUser: t.id }))
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    this.defenseService.updateDefense(payload.idDefense, payload).subscribe({
      next: () => {
        this.toastr.success('Defense updated successfully!', 'Success');
        this.router.navigate(['/defenses']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.handleError(err);
      }
    });
  }
  
  public handleError(error: HttpErrorResponse): void {
    let errorMessage = 'Failed to update defense. Please try again later.';
    
    if (error.status === 400) {
      errorMessage = error.error?.error || 'Invalid request data';
    } else if (error.status === 409) {
      errorMessage = error.error?.message || 'Scheduling conflict detected';
    } else if (error.status === 415) {
      errorMessage = 'Invalid data format. Please check your input.';
    }

    this.toastr.error(errorMessage, 'Update Error');
    console.error('Defense update error:', error);
  }
  goBack(): void {
    this.router.navigate(['/defenses']);
  }
}