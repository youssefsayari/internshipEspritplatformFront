import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../services/document.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-generate-cv',
  templateUrl: './generate-cv.component.html',
  styleUrls: ['./generate-cv.component.scss']
})
export class GenerateCvComponent implements OnInit {
  userId: number;
  cvPreviewUrl: SafeResourceUrl | null = null; // To store the sanitized preview URL

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private sanitizer: DomSanitizer // Inject sanitizer for URL security
  ) {}

  ngOnInit(): void {
    this.userId = 1; // Example user ID, set it dynamically as needed
  }

  generateCV(): void {
    this.documentService.generateStudentCV(this.userId).subscribe(
      (response) => {
        // Create a Blob and generate a URL for it
        const file = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(file);

        // Sanitize the URL before binding it to the iframe
        this.cvPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

        Swal.fire({
          icon: 'success',
          title: 'CV Generated',
          text: 'Your CV has been successfully generated.',
          confirmButtonText: 'Ok'
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error generating your CV.',
          confirmButtonText: 'Retry'
        });
      }
    );
  }

  downloadCV(): void {
    this.documentService.downloadStudentCV(this.userId).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `CV_${this.userId}.pdf`;
        link.click();
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error downloading your CV.',
          confirmButtonText: 'Retry'
        });
      }
    );
  }
  goBack() {
    this.router.navigate(['/predefined-documents']);
  }
}
