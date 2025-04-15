import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; 
import { DefenseService } from '../Services/defense.service';
import { Defense } from '../models/defense';
import { DatePipe } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-defense-details',
  templateUrl: './defense-details.component.html',
  styleUrls: ['./defense-details.component.scss'],
  providers: [DatePipe]
})
export class DefenseDetailsComponent implements OnInit {
  defense: Defense | null = null;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private defenseService: DefenseService,
    private datePipe: DatePipe,
    private router: Router,
    private location: Location 
  ) {}

  ngOnInit(): void {
    const defenseId = history.state.defenseId;
  
    if (defenseId) {
      this.loadDefense(+defenseId);
    } else {
      this.errorMessage = 'No defense ID provided';
      this.isLoading = false;
    }
  }
  

  private loadDefense(id: number): void {
    this.defenseService.getDefenseById(id).subscribe({
      next: (defense) => {
        this.defense = defense;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load defense details';
        this.isLoading = false;
        console.error('Error loading defense:', err);
      }
    });
  }

  getFormattedDate(): string {
    if (!this.defense?.defenseDate) return 'Not scheduled';
    const date = new Date(this.defense.defenseDate);
    return this.datePipe.transform(date, 'fullDate') || 'Invalid date';
  }

  getFormattedTime(): string {
    if (!this.defense?.defenseTime) return 'Not scheduled';
    const time = new Date(`1970-01-01T${this.defense.defenseTime}`);
    return this.datePipe.transform(time, 'shortTime') || 'Invalid time';
  }

  goBack(): void {
    this.location.back(); // Goes to the previous page in history
  }
}