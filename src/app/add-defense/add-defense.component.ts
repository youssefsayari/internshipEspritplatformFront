import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DefenseService } from '../Services/defense.service';
import { UserService } from '../Services/user.service';
import { User } from '../models/user';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import {TimeLineService} from "../Services/time-line.service";

@Component({
  selector: 'app-add-defense',
  templateUrl: './add-defense.component.html',
  styleUrls: ['./add-defense.component.scss'],
  providers: [DatePipe]
})
export class AddDefenseComponent implements OnInit {
  defenseForm!: FormGroup;
  students: any[] = [];
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
    private router: Router,
    private datePipe: DatePipe,
    private timeLineService: TimeLineService 
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUsers();
  }

  initializeForm(): void {
    this.defenseForm = this.fb.group({
      studentId: ['', Validators.required],
      defenseDate: ['', [Validators.required, this.futureDateValidator]],
      defenseTime: ['', [
        Validators.required, 
        Validators.pattern('^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'),
        this.timeRangeValidator
      ]],
      classroom: ['', [Validators.required, Validators.maxLength(50)]],
      reportSubmitted: [true],
      internshipCompleted: [true],
      tutorIds: [[], [Validators.required, this.exactlyThreeTutorsValidator]]
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

  loadUsers(): void {
    this.isLoading = true;
  
    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => {
        const students = data.filter(u => u.typeUser === 'Student');
        const tutors = data.filter(u => u.typeUser === 'Tutor')
          .sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
  console.log('Tutors:', tutors);
        console.log('Students:', students);
        this.tutors = tutors;
        this.students = [];
  
        let pending = students.length;
  
        if (pending === 0) {
          this.isLoading = false;
          return;
        }
  
        students.forEach(student => {
          this.timeLineService.getTimeLinesByUserId(student.idUser).subscribe({
            next: (timelines) => {
              const allApproved = timelines.length > 0 && timelines.every(t => t.timeLaneState === 'ACCEPTED');
              if (allApproved) {
                this.students.push(student);
                this.students.sort((a, b) => (a.lastName || '').localeCompare(b.lastName || ''));
              }
  
              pending--;
              if (pending === 0) {
                this.isLoading = false;
              }
            },
            error: (err) => {
              console.error(`Error fetching timelines for student ID ${student.id}:`, err);
              pending--;
              if (pending === 0) {
                this.isLoading = false;
              }
            }
          });
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les utilisateurs.',
          confirmButtonColor: '#4361ee'
        });
      }
    });
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
    const payload = {
      defenseDate: this.datePipe.transform(formValue.defenseDate, 'yyyy-MM-dd'),
      defenseTime: formValue.defenseTime,
      classroom: formValue.classroom,
      reportSubmitted: true,
      internshipCompleted: true,
      tutorIds: formValue.tutorIds
    };

    console.log('Sending payload:', payload);

    this.isSubmitting = true;
    this.defenseService.addDefense(formValue.studentId, payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Defense scheduled successfully!',
          confirmButtonColor: '#4361ee',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/defenses']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Full error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Failed to schedule defense. Status: ' + error.status,
          confirmButtonColor: '#4361ee'
        });
      }
    });
  }

  get f() { return this.defenseForm.controls; }

  goBack(): void {
    this.router.navigate(['/defenses']);
  }
}