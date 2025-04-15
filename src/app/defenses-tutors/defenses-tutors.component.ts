import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DefenseService } from '../Services/defense.service';
import { EvaluationService } from '../Services/evaluation.service';
import { UserService } from '../Services/user.service';
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
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (user) => {
          this.currentTutorId = user.id;
          this.loadDefenses();
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

  loadDefenses(): void {
    this.isLoading = true;
    this.defenseService.getDefensesByTutorId(this.currentTutorId).subscribe({
      next: (data: Defense[]) => {
        this.defenses = data;
        this.totalDefenses = this.defenses.length;
        this.isLoading = false;
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
    return defense.evaluations?.some(e =>
      e.tutorId === this.currentTutorId && e.status === 'SUBMITTED'
    ) ?? false;
  }

  getEvaluationProgress(defense: Defense): number {
    const submittedCount = defense.evaluations?.filter(e => e.status === 'SUBMITTED').length || 0;
    return (submittedCount / 3) * 100;
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
  
    // Navigate with defenseId in state
    this.router.navigate(['/defenses/evaluate'], { state: { defenseId } });
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

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  getSubmittedEvaluationsCount(defense: Defense): number {
    return defense.evaluations?.filter(e => e.status === 'SUBMITTED').length || 0;
  }

  getTutorEvaluation(defense: Defense): Evaluation | undefined {
    return defense.evaluations?.find(e => e.tutorId === this.currentTutorId);
  }

  viewEvaluation(defenseId: number): void {
    const defense = this.defenses.find(d => d.idDefense === defenseId);
    const tutorEvaluation = defense?.evaluations?.find(e => e.tutorId === this.currentTutorId);

    if (tutorEvaluation?.status === 'SUBMITTED') {
      this.router.navigate([`/evaluation-view/${defenseId}`]); 
    } else {
      Swal.fire({
        icon: 'info',
        title: 'No Evaluation Found',
        text: 'You have not submitted an evaluation for this defense yet.',
        confirmButtonColor: '#3085d6'
      });
    }
  }

  viewDefenseOrEvaluation(defense: Defense): void {
    if (!this.hasEvaluated(defense)) {
      Swal.fire({
        icon: 'info',
        title: 'Évaluation manquante',
        text: 'Vous n\'avez pas encore soumis une évaluation pour cette soutenance.',
        confirmButtonColor: '#3085d6'
      });
    }
  
    this.router.navigate([`/evaluation-view/${defense.idDefense}`]);
  }
  

  goToTutorCalendar(): void {
    this.router.navigate(['/tutor-calendar']); 
  } 
  
  generateEvaluationGrid(defenseId: number, tutorId: number): void {
    this.defenseService.generateEvaluationGrid(defenseId).subscribe({
      next: (response) => {
        // Store the PDF URL in local storage (or use another method to pass data)
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          localStorage.setItem('evaluationGrid', base64Data);
        };
        reader.readAsDataURL(response);
        // Navigate to the evaluation grid preview page
        this.router.navigate([`/evaluation-grid-preview/${defenseId}`]);
      },
      error: (error) => {
        console.error('Error generating evaluation grid:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an issue generating the evaluation grid.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}
