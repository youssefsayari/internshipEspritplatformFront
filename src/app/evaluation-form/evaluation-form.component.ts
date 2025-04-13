import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../Services/evaluation.service';
import { DefenseService } from '../Services/defense.service';
import Swal from 'sweetalert2';
import { Evaluation } from '../models/evaluation';
import { Defense } from '../models/defense';
import { User } from '../models/user';


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
  categories = ['Excellent', 'Average', 'Bad']; // Ensure correct spelling


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService,
    private defenseService: DefenseService
  ) {
    this.evaluationForm = this.fb.group({
      grade: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      remarks: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    // Extract defenseId and tutorId from the URL path
    this.defenseId = +this.route.snapshot.paramMap.get('defenseId')!;
    this.tutorId = +this.route.snapshot.paramMap.get('tutorId')!;
    
    console.log('Defense ID:', this.defenseId);  // Debug log
    console.log('Tutor ID:', this.tutorId);  // Debug log

    this.loadDefenseDetails();
    this.checkExistingEvaluation();
  }

  loadDefenseDetails(): void {
    this.isLoading = true;
    this.defenseService.getDefenseById(this.defenseId).subscribe({
      next: (defense) => {
        this.defense = defense;
        console.log('Defense details:', defense); // Debug log
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading defense:', err);
        Swal.fire('Error', 'Failed to load defense details', 'error');
        this.router.navigate([`/defenses-tutors/${this.tutorId}`]);
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
          this.router.navigate([`/defenses-tutors/${this.tutorId}`]);
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

   // Format date for display
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
  getCategoryIcon(category: string): string {
    switch(category.toLowerCase()) {
      case 'excellent': return 'emoji_events'; // Fixed typo
      case 'average': return 'trending_flat';
      case 'bad': return 'warning';
      default: return 'person';
    }
  }

  // Format time for display
  formatTime(timeString: string): string {
    if (!timeString) return 'N/A';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      console.error('Error formatting time:', e);
      return 'Invalid time';
    }
  }
  goBack(): void {
    if (this.tutorId) {
      this.router.navigate([`/defenses-tutors/${this.tutorId}`]);
    } else {
      // Fallback in case tutorId isn't available for some reason
      this.router.navigate(['/defenses-tutors']);
    }
  }
}
