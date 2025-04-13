import { Component, OnInit } from '@angular/core';
import { DefenseService } from '../Services/defense.service';
import { Defense } from '../models/defense';

@Component({
  selector: 'app-defense-stats',
  templateUrl: './defense-stats.component.html',
  styleUrls: ['./defense-stats.component.scss']
})
export class DefenseStatsComponent implements OnInit {
  defenseStats: { [key: string]: Defense[] } = {
    Excellent: [],
    Average: [],
    Bad: [],
    'Not Evaluated': [] // Add the Not Evaluated category
  };
  isLoading = true;
  hasError = false;

  constructor(private defenseService: DefenseService) {}

  getCategoryIcon(category: string): string {
    switch(category.toLowerCase()) {
      case 'excellent': return 'emoji_events';
      case 'average': return 'trending_flat';
      case 'bad': return 'warning';
      case 'not evaluated': return 'hourglass_empty'; // Add icon for Not Evaluated
      default: return 'person';
    }
  }

  // In your DefenseStatsComponent class
  getStudentName(defense: Defense): string {
    if (!defense?.student) return 'Unnamed Student';
    const firstName = defense.student.firstName?.trim() || '';
    const lastName = defense.student.lastName?.trim() || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || 'Unnamed Student';
  }

  getStudentInitial(defense: Defense): string {
    if (!defense?.student) return '?';
    const firstInitial = defense.student.firstName?.[0]?.toUpperCase() || '';
    const lastInitial = defense.student.lastName?.[0]?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || '?';
  }

  validateScore(degree: number): number {
    return Math.min(Math.max(degree || 0, 0), 20);
  }

  formatScore(degree: number): string {
    return this.validateScore(degree).toFixed(1);
  }

  getCategoryCount(category: string): number {
    return this.defenseStats[category]?.length || 0;
  }

  getTotalStudents(): number {
    return ['Excellent', 'Average', 'Bad', 'Not Evaluated'].reduce(
      (total, category) => total + this.getCategoryCount(category), 0
    );
  }

  ngOnInit(): void {
    this.defenseService.getDefenseStats().subscribe({
      next: (stats) => {
        this.defenseStats = {
          Excellent: stats.Excellent || [],
          Average: stats.Average || [],
          Bad: stats.Bad || [],
          'Not Evaluated': stats['Not Evaluated'] || [] // Handle the Not Evaluated category
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.hasError = true;
        this.isLoading = false;
      }
    });
  }
}
