import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefenseService } from '../Services/defense.service';
import { EvaluationService } from '../Services/evaluation.service';
import { Defense } from '../models/defense';
import { Evaluation } from '../models/evaluation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-defenses-tutors',
  templateUrl: './defenses-tutors.component.html',
  styleUrls: ['./defenses-tutors.component.scss']
})
export class DefensesTutorsComponent implements OnInit {
  defenses: Defense[] = [];
  page: number = 1;
  itemsPerPage: number = 5;
  totalDefenses: number = 0;
  isLoading: boolean = true;
  currentTutorId: number = 0;

  constructor(
    private defenseService: DefenseService,
    private evaluationService: EvaluationService,
    private router: Router,
    private activatedRoute: ActivatedRoute // Inject ActivatedRoute to get the tutor ID from URL
  ) {}

  ngOnInit(): void {
    // Get tutorId from the URL and load defenses
    this.activatedRoute.params.subscribe(params => {
      this.currentTutorId = +params['tutorId']; // Assuming tutorId is part of the route parameters
      this.loadDefenses();
    });
  }

  loadDefenses(): void {
    this.isLoading = true;
    this.defenseService.getDefensesByTutorId(this.currentTutorId).subscribe({
      next: (data: Defense[]) => {
        this.defenses = data;
        this.totalDefenses = this.defenses.length;
        this.isLoading = false;
        console.log('Defenses loaded for tutor:', this.defenses);
      },
      error: (error) => {
        console.error('Error fetching defenses:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Loading Failed',
          text: 'There was an issue loading your defenses.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  hasEvaluated(defense: Defense): boolean {
    if (!defense.evaluations) return false;
    return defense.evaluations.some(e => 
      e.tutorId === this.currentTutorId && 
      e.status === 'SUBMITTED'
    );
  }

  getEvaluationProgress(defense: Defense): number {
    if (!defense.evaluations) return 0;
    const submittedCount = defense.evaluations.filter(e => e.status === 'SUBMITTED').length;
    return (submittedCount / 3) * 100; // Assuming 3 tutors per defense
  }

  evaluateDefense(defenseId: number): void {
    const defense = this.defenses.find(d => d.idDefense === defenseId);
    if (defense && this.hasEvaluated(defense)) {
      Swal.fire({
        icon: 'info',
        title: 'Already Evaluated',
        text: 'You have already submitted your evaluation for this defense.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
  
    // Navigate with both defenseId and tutorId
    this.router.navigate([`/defenses/${defenseId}/evaluate/${this.currentTutorId}`]);
  }

  viewDefenseDetails(id: number): void {
    this.router.navigate(['/defenses', id]);
  }

  get paginatedDefenses(): Defense[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.defenses.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalDefenses / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }

  getPages(): number[] {
    const maxVisiblePages = 5;
    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, this.page - half);
    let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({length: end - start + 1}, (_, i) => start + i);
  }

  getSubmittedEvaluationsCount(defense: Defense): number {
    return defense.evaluations?.filter(e => e.status === 'SUBMITTED').length || 0;
  }

  getTutorEvaluation(defense: Defense): Evaluation | undefined {
    return defense.evaluations?.find(e => e.tutorId === this.currentTutorId);
  }
}
