import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../Services/evaluation.service';
import { DefenseService } from '../Services/defense.service';
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
  tutorId: number = 2; // Static tutor ID (should come from auth in real app)
  defense: Defense;
  existingEvaluation: Evaluation | null = null;
  isLoading: boolean = true;
  isSubmitting: boolean = false;

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
    this.defenseId = +this.route.snapshot.paramMap.get('id')!;
    this.loadDefenseDetails();
    this.checkExistingEvaluation();
  }

  loadDefenseDetails(): void {
    this.defenseService.getDefenseById(this.defenseId).subscribe({
      next: (defense) => {
        this.defense = defense;
      },
      error: (err) => {
        console.error('Error loading defense:', err);
        Swal.fire('Error', 'Failed to load defense details', 'error');
        this.router.navigate(['/defenses']);
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
          this.router.navigate(['/defenses']);
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
}