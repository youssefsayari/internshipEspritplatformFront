import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DocumentService } from '../Services/document.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TypeDocument } from '../models/TypeDocument'; // Import the enum
import { Router } from '@angular/router'; // ✅ Import Router
import Swal from 'sweetalert2'; // Import SweetAlert2

@Component({
  selector: 'app-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.scss']
})
export class AddDocumentComponent implements OnInit {
  document = {
    name: '',
    typeDocument: TypeDocument.JOURNAL
  };

  // Convert enum to string array
  documentTypes: string[] = Object.keys(TypeDocument).filter(key => isNaN(Number(key)));

  selectedFile: File | null = null;
  pdfPreviewUrl: SafeResourceUrl | null = null;

  // Store error messages for each field
  fieldErrors: { [key: string]: string } = {
    name: '',
    typeDocument: '',
    file: ''
  };

  constructor(
    private documentService: DocumentService, 
    private sanitizer: DomSanitizer,
    private router: Router // ✅ Inject Router
  ) {}

  ngOnInit(): void {}

  // Handle file selection and PDF preview
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;

      // Generate Safe URL for PDF Preview
      const fileURL = URL.createObjectURL(file);
      this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
    } else {
      this.selectedFile = null;
      this.pdfPreviewUrl = null;
      this.fieldErrors.file = 'Please select a valid PDF file.';
    }
  }

  // Frontend validation before submitting
  validateForm(): boolean {
    let isValid = true;

    // Reset errors
    this.fieldErrors = { name: '', typeDocument: '', file: '' };

    if (!this.document.name || this.document.name.trim().length === 0) {
      this.fieldErrors.name = 'Document name is required.';
      isValid = false;
    }

    if (!this.document.typeDocument) {
      this.fieldErrors.typeDocument = 'Document type is required.';
      isValid = false;
    }

    if (!this.selectedFile) {
      this.fieldErrors.file = 'Please upload a PDF file.';
      isValid = false;
    } else if (this.selectedFile && this.selectedFile.type !== 'application/pdf') {
      this.fieldErrors.file = 'File must be a PDF.';
      isValid = false;
    }

    return isValid;
  }

  // Submit the form
  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      const formData = new FormData();
      formData.append('name', this.document.name);
      formData.append('typeDocument', this.document.typeDocument.toString());
      formData.append('file', this.selectedFile as Blob); // ✅ Ensure File is not null

      this.documentService.addDocument(formData).subscribe(
        (response) => {
          console.log('Document uploaded successfully:', response);
          Swal.fire({
            icon: 'success',
            title: 'Document Added',
            text: 'Your document has been uploaded successfully.',
            confirmButtonText: 'Ok'
          }).then(() => {
            this.router.navigate(['/document-list']); // ✅ Use Router to navigate
          });

          form.resetForm();
          this.selectedFile = null;
          this.pdfPreviewUrl = null;
        },
        (error) => {
          console.error('Error uploading document:', error);

          if (error.error && error.error.errors) {
            // Handle backend error messages and display in frontend
            const errors = error.error.errors;
            for (let errorMessage of errors) {
              if (errorMessage.includes('Document name')) {
                this.fieldErrors.name = errorMessage;
              } else if (errorMessage.includes('Document type')) {
                this.fieldErrors.typeDocument = errorMessage;
              } else if (errorMessage.includes('PDF file')) {
                this.fieldErrors.file = errorMessage;
              }
            }

            Swal.fire({
              icon: 'error',
              title: 'Upload Failed',
              text: errors.join(' '),
              confirmButtonText: 'Ok'
            });
          }
        }
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Form Validation Failed',
        text: 'Please fix the validation errors before submitting.',
        confirmButtonText: 'Ok'
      });
    }
  }

  // 🔙 Go Back to Document List
  goBack() {
    this.router.navigate(['/document-list']);
  }
}