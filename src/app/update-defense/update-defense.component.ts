import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DefenseService } from '../Services/defense.service';
import { UserService } from '../Services/user.service';
import { User } from '../models/user';
import { Defense } from '../models/defense';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-update-defense',
  templateUrl: './update-defense.component.html',
  styleUrls: ['./update-defense.component.scss'],
  providers: [DatePipe]
})
export class UpdateDefenseComponent implements OnInit {
  defenseForm!: FormGroup;
  defenseId!: number;
  students: User[] = [];
  tutors: User[] = [];
  isSubmitting = false;
  isLoading = false;
  today = new Date().toISOString().split('T')[0];
  minTime = '08:00';
  maxTime = '18:00';
  selectedTutors: number[] = [];

  constructor(
    private fb: FormBuilder,
    private defenseService: DefenseService,
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.defenseId = this.route.snapshot.params['id'];
    this.initializeForm();
    this.loadDefenseData();
    this.loadUsers();
  }

  initializeForm(): void {
    this.defenseForm = this.fb.group({
      idDefense: [''],
      student: this.fb.group({
        idUser: ['', Validators.required]
      }),
      defenseDate: ['', [Validators.required, this.futureDateValidator]],
      defenseTime: ['', [
        Validators.required, 
        Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),
        this.timeRangeValidator
      ]],
      classroom: ['', [Validators.required, Validators.maxLength(50)]],
      defenseDegree: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      reportSubmitted: [true, Validators.required],
      internshipCompleted: [true, Validators.required],
      tutorIds: [[], [Validators.required, this.exactlyThreeTutorsValidator]]
    });
  }

  loadDefenseData(): void {
    this.isLoading = true;
    this.defenseService.getDefenseById(this.defenseId).subscribe({
      next: (defense: Defense) => {
        this.defenseForm.patchValue({
          idDefense: defense.idDefense,
          student: { idUser: defense.student.id },
          defenseDate: defense.defenseDate,
          defenseTime: defense.defenseTime,
          classroom: defense.classroom,
          defenseDegree: defense.defenseDegree,
          reportSubmitted: defense.reportSubmitted,
          internshipCompleted: defense.internshipCompleted,
          tutorIds: defense.tutors.map(t => t.id)
        });
        this.selectedTutors = defense.tutors.map(t => t.id);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading defense:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load defense data. Please try again.',
          confirmButtonColor: '#4361ee'
        }).then(() => {
          this.router.navigate(['/defenses']);
        });
      }
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe({
      next: (data: User[]) => {
        this.students = data.filter(u => u.typeUser === 'Student')
          .sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
        this.tutors = data.filter(u => u.typeUser === 'Tutor')
          .sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load users. Please try again.',
          confirmButtonColor: '#4361ee'
        });
      }
    });
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

  exactlyThreeTutorsValidator = (control: AbstractControl): {[key: string]: any} | null => {
    return control.value?.length === 3 ? null : { invalidTutorCount: true };
  }

  onTutorSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions);
    
    if (selectedOptions.length > 3) {
      const lastThree = selectedOptions.slice(-3);
      this.selectedTutors = lastThree.map(option => Number(option.value));
      
      Array.from(selectElement.options).forEach(option => {
        option.selected = this.selectedTutors.includes(Number(option.value));
      });
      
      Swal.fire({
        icon: 'warning',
        title: 'Maximum tutors selected',
        text: 'You can only select 3 tutors for a defense',
        confirmButtonColor: '#4361ee',
        timer: 2000
      });
    } else {
      this.selectedTutors = selectedOptions.map(option => Number(option.value));
    }
    
    this.defenseForm.get('tutorIds')?.setValue(this.selectedTutors);
    this.defenseForm.get('tutorIds')?.markAsTouched();
    
    if (this.selectedTutors.length !== 3) {
      this.defenseForm.get('tutorIds')?.setErrors({ invalidTutorCount: true });
    } else {
      this.defenseForm.get('tutorIds')?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.defenseForm.invalid || this.isSubmitting) {
      this.defenseForm.markAllAsTouched();
      return;
    }

    const formValue = this.defenseForm.value;
    const payload: Defense = new Defense(
      formValue.idDefense,
      this.datePipe.transform(formValue.defenseDate, 'yyyy-MM-dd') || '',
      formValue.defenseTime,
      formValue.classroom,
      formValue.reportSubmitted,
      formValue.internshipCompleted,
      formValue.defenseDegree,
      this.students.find(s => s.id === formValue.student.idUser)!,
      this.tutors.filter(t => formValue.tutorIds.includes(t.id))
    );
    
    // Validate the payload before sending
    try {
      payload.validate();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: error.message,
        confirmButtonColor: '#4361ee'
      });
      return;
    }

    this.isSubmitting = true;
    this.defenseService.updateDefense(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Defense updated successfully!',
          confirmButtonColor: '#4361ee',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/defenses']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to update defense. Please try again.',
          confirmButtonColor: '#4361ee'
        });
      }
    });
  }

  get f() { return this.defenseForm.controls; }
}