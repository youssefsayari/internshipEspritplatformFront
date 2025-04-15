import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DefenseService } from '../Services/defense.service';
import { Defense } from '../models/defense';
import { DatePipe } from '@angular/common';
import { UserService } from '../Services/user.service';

@Component({
  selector: 'app-my-defense',
  templateUrl: './student-defense.component.html',
  styleUrls: ['./student-defense.component.scss'],
  providers: [DatePipe]
})
export class StudentDefenseComponent implements OnInit {
  defense?: Defense;
  isLoading = true;
  hasError = false;

  constructor(
    private route: ActivatedRoute,
    private defenseService: DefenseService,
    private datePipe: DatePipe,
    private userService: UserService,
    private router: Router
  ) { }

  get tutors() {
    return this.defense?.tutors || [];
  }

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    if (token) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (user) => {
          this.loadDefenseForStudent(user.id);
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

  private loadDefenseForStudent(studentId: number): void {
    this.defenseService.getDefensesByStudentId(studentId).subscribe({
      next: (defenses) => {
        if (defenses.length > 0) {
          this.defense = {
            ...defenses[0],
            tutors: defenses[0].tutors || [],
            validate: function () {
              if (!this.tutors || this.tutors.length !== 3) {
                throw new Error('A defense must have exactly 3 tutors');
              }
              if (!this.internshipCompleted) {
                throw new Error('Cannot schedule defense for incomplete internship');
              }
            }
          };
        }
        this.isLoading = false;
        console.log('Loaded defense:', this.defense); // Debug log
      },
      error: (err) => {
        this.handleError(err);
      }
    });
  }

  private handleError(error: any): void {
    console.error('Error:', error);
    this.hasError = true;
    this.isLoading = false;
  }

  // Add these methods for safer array access
  get evaluations() {
    return this.defense?.evaluations || [];
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return 'Not scheduled';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : this.datePipe.transform(date, 'fullDate') || '';
  }

  getFormattedTime(timeString: string): string {
    if (!timeString) return 'Not scheduled';
    const time = new Date(`1970-01-01T${timeString}`);
    return isNaN(time.getTime()) ? 'Invalid time' : this.datePipe.transform(time, 'shortTime') || '';
  }

  areAllEvaluationsSubmitted(): boolean {
    return this.defense?.evaluations?.length === 3 && 
           this.defense.evaluations.every(e => e?.status === 'SUBMITTED');
  }

  maxEvaluationGrade(): number {
    return Math.max(...this.defense.evaluations.map(e => e.grade));
  }
  
  minEvaluationGrade(): number {
    return Math.min(...this.defense.evaluations.map(e => e.grade));
  }
}
