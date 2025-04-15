import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationService } from '../Services/evaluation.service';
import { DefenseService } from '../Services/defense.service';
import { UserService } from '../Services/user.service'; // Import the UserService
import { Evaluation } from '../models/evaluation';
import { Defense } from '../models/defense';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-view',
  templateUrl: './evaluation-view.component.html',
  styleUrls: ['./evaluation-view.component.scss']
})
export class EvaluationViewComponent implements OnInit {
  defenseId: number;
  tutorId: number;
  defense: Defense;
  evaluation: Evaluation;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private evaluationService: EvaluationService,
    private defenseService: DefenseService,
    private userService: UserService // Inject UserService
  ) { }

  ngOnInit(): void {
    // Get the defenseId from the route params
    this.defenseId = +this.route.snapshot.paramMap.get('defenseId')!;
    
    // Fetch the tutor ID from the token
    const token = localStorage.getItem('Token');
    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          this.tutorId = userDetails.id; // Use the tutor's ID from the token

          if (isNaN(this.defenseId) || isNaN(this.tutorId)) {
            this.router.navigate(['/']);
            return;
          }

          this.loadData();
        },
        error: (err) => {
          console.error("Error decoding token:", err);
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load defense details
    this.defenseService.getDefenseById(this.defenseId).subscribe({
      next: (defense) => {
        this.defense = defense;
        this.loadEvaluation();
      },
      error: (err) => {
        console.error('Error loading defense:', err);
        this.isLoading = false;
        this.router.navigate([`/defenses-tutors`]); // Redirect to tutor view
      }
    });
  }

  loadEvaluation(): void {
    this.evaluationService.getDefenseEvaluations(this.defenseId).subscribe({
      next: (evaluations) => {
        const tutorEvaluation = evaluations.find(e => e.tutorId === this.tutorId);
        if (tutorEvaluation) {
          this.evaluation = tutorEvaluation;
        } else {
          this.evaluation = null; // No evaluation yet
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading evaluation:', err);
        this.evaluation = null;
        this.isLoading = false;
      }
    });
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
    this.router.navigate([`/defenses-tutors`]);
  }
}
