import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../Services/evaluation.service';
import { DefenseService } from '../Services/defense.service';
import { UserService } from '../Services/user.service';
import Swal from 'sweetalert2';
import { Evaluation } from '../models/evaluation';
import { Defense } from '../models/defense';

@Component({
  selector: 'app-evaluation-form',
  templateUrl: './evaluation-form.component.html',
  styleUrls: ['./evaluation-form.component.scss']
})
export class EvaluationFormComponent implements OnInit {
  evaluationForm: FormGroup;
  defenseId: number;
  tutorId: number;
  defense: Defense;
  existingEvaluation: Evaluation | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  categories = ['Excellent', 'Average', 'Bad'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService,
    private defenseService: DefenseService,
    private userService: UserService
  ) {
    this.evaluationForm = this.fb.group({
      grade: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      remarks: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (user) => {
          this.tutorId = user.id;
          
          // Get defenseId from the navigation state
          const defenseId = history.state?.defenseId;
          
          if (defenseId) {
            this.defenseId = +defenseId;
            this.loadDefenseDetails();
            this.checkExistingEvaluation();
          } else {
            console.error("No defense ID found in state.");
            this.router.navigate(['/defenses']);
          }
        },
        error: (err) => {
          console.error("Token decoding error:", err);
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
  

  loadDefenseDetails(): void {
    this.isLoading = true;
    this.defenseService.getDefenseById(this.defenseId).subscribe({
      next: (defense) => {
        this.defense = defense;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading defense:', err);
        Swal.fire('Error', 'Failed to load defense details', 'error');
        this.router.navigate(['/defenses-tutors']);
        this.isLoading = false;
      }
    });
  }

  checkExistingEvaluation(): void {
    this.evaluationService.getDefenseEvaluations(this.defenseId).subscribe({
      next: (evaluations) => {
        const tutorEvaluation = evaluations.find(e => e.tutorId === this.tutorId);
        if (tutorEvaluation) {
          this.existingEvaluation = tutorEvaluation;
          this.evaluationForm.patchValue({
            grade: tutorEvaluation.grade,
            remarks: tutorEvaluation.remarks
          });
          if (tutorEvaluation.status === 'SUBMITTED') {
            this.evaluationForm.disable();
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error checking evaluations:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.evaluationForm.invalid) {
      this.evaluationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const evaluationData: Evaluation = {
      defenseId: this.defenseId,
      tutorId: this.tutorId,
      grade: this.evaluationForm.value.grade,
      remarks: this.evaluationForm.value.remarks,
      status: 'SUBMITTED'
    };

    this.evaluationService.submitEvaluation(evaluationData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Evaluation Submitted!',
          text: 'Your evaluation has been successfully submitted.',
          confirmButtonColor: '#3085d6'
        }).then(() => {
          this.router.navigate(['/defenses-tutors']);
        });
      },
      error: (err) => {
        console.error('Error submitting evaluation:', err);
        this.isSubmitting = false;
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: err.error?.message || 'There was an error submitting your evaluation',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  get grade() {
    return this.evaluationForm.get('grade');
  }

  get remarks() {
    return this.evaluationForm.get('remarks');
  }

  getStudentName(): string {
    if (!this.defense?.student) return 'N/A';
    const firstName = this.defense.student.firstName || '';
    const lastName = this.defense.student.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'N/A';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Invalid date';
    }
  }

  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(+hours, +minutes);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.error('Error formatting time:', e);
      return 'Invalid time';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category.toLowerCase()) {
      case 'excellent': return 'emoji_events';
      case 'average': return 'trending_flat';
      case 'bad': return 'warning';
      default: return 'person';
    }
  }
}
