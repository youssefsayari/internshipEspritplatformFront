import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DefenseService } from '../Services/defense.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluation-grid-preview',
  templateUrl: './evaluation-grid-preview.component.html',
  styleUrls: ['./evaluation-grid-preview.component.scss']
})
export class EvaluationGridPreviewComponent implements OnInit {
  pdfUrl: SafeResourceUrl | null = null;
  isLoading: boolean = true;
  defenseId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private location: Location,
    private defenseService: DefenseService
    
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('defenseId');
      if (id) {
        this.defenseId = +id;
        this.generateEvaluationGrid(this.defenseId); // 🔁 Generate on route param change
      }
    });
  }

  generateEvaluationGrid(defenseId: number): void {
    this.isLoading = true;
    this.defenseService.generateEvaluationGrid(defenseId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result as string;
          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(base64Data);
          localStorage.setItem('evaluationGrid', base64Data); // Optional: cache it
          this.isLoading = false;
        };
        reader.readAsDataURL(blob);
      },
      error: (error) => {
        console.error('Error generating evaluation grid:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an issue generating the evaluation grid.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  downloadEvaluationGrid(): void {
    if (this.pdfUrl && typeof this.pdfUrl === 'string') {
      const link = document.createElement('a');
      link.href = this.pdfUrl;
      link.download = 'EvaluationGrid.pdf';
      link.click();
    }
  }
  goBack(): void {
    this.location.back(); // Goes to the previous page in history
  }
}
