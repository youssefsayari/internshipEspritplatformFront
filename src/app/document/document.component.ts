import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../Services/document.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  documents = [
    { type: 'CV', displayName: 'Curriculum Vitae', file: null as File | null, previewUrl: null as SafeResourceUrl | null },
    { type: 'RAPPORT', displayName: 'Internship Report', file: null as File | null, previewUrl: null as SafeResourceUrl | null },
    { type: 'JOURNAL', displayName: 'Internship Journal', file: null as File | null, previewUrl: null as SafeResourceUrl | null },
    { type: 'LETTRE_AFFECTATION', displayName: 'Lettre d\'Affectation', file: null as File | null, previewUrl: null as SafeResourceUrl | null },
  ];

  constructor(
    private documentService: DocumentService, 
    private sanitizer: DomSanitizer, 
    private router: Router
  ) {}

  ngOnInit(): void {}

  onFileSelected(event: any, docType: string) {
    const file = event.target.files[0];
    const document = this.documents.find(doc => doc.type === docType);

    if (!document) return;

    if (file && file.type === 'application/pdf') {
      document.file = file;
      const fileURL = URL.createObjectURL(file);
      document.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select a valid PDF file!',
        confirmButtonColor: '#d33'
      });

      document.file = null;
      document.previewUrl = null;
    }
  }

  onSubmit() {
    if (this.documents.some(doc => !doc.file)) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Files',
        text: 'Please upload all required documents!',
        confirmButtonColor: '#ffc107'
      });
      return;
    }
  
    const formData = new FormData();
    this.documents.forEach(doc => {
      if (doc.file) {
        formData.append('files', doc.file); // Append each file under the 'files' key
        formData.append('types', doc.type);  // Append document type
      }
    });
  
    this.documentService.uploadDocuments(formData).subscribe(
      (response: any) => {
        if (response && response.message) {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: response.message,
            confirmButtonColor: '#28a745'
          }).then(() => {
            this.router.navigate(['/predefined-documents']);
          });
        } else {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Documents uploaded successfully.',
            confirmButtonColor: '#28a745'
          });
        }
      },
      error => {
        console.error('Error uploading documents:', error);
        if (error.error && error.error.message && error.error.message.includes("already uploaded")) {
          Swal.fire({
            icon: 'warning',
            title: 'Duplicate Upload',
            text: 'You have already uploaded these documents!',
            confirmButtonColor: '#ff9800'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            text: 'There was an issue uploading the documents.',
            confirmButtonColor: '#d33'
          });
        }
      }
    );
  }
  
  
}
