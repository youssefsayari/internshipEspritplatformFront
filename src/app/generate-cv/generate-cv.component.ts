import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../Services/document.service';
import { UserService } from "../Services/user.service";
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
    private sanitizer: DomSanitizer, private userService: UserService // Inject sanitizer for URL security
  ) {}

  ngOnInit(): void {
 this.fetchUserDetails();
  }
  fetchUserDetails() {
      const token = localStorage.getItem('Token');
      if (!token) return;
  
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          localStorage.setItem('userRole', userDetails.role);
          localStorage.setItem('userClasse', userDetails.classe);
          this.userId = userDetails.id;
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: '⚠️ Error',
            text: 'Failed to fetch user details. Please log in again.',
            width: '50%',
            customClass: {
              popup: 'swal-custom-popup',
              confirmButton: 'swal-custom-button'
            }
          });
        }
      });
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
