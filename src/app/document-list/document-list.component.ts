import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../Services/document.service';
import { Document } from '../models/document';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  page: number = 1;
  itemsPerPage: number = 4; // Number of documents per page
  totalDocuments: number = 0;
  isLoading: boolean = true;

  constructor(private documentService: DocumentService, private router: Router) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.documentService.getAllDocuments().subscribe(
      (data) => {
        this.documents = data;
        this.totalDocuments = data.length;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching documents:', error);
        this.isLoading = false;
      }
    );
  }

  viewDocumentDetails(documentId: number): void {
    this.router.navigate(['/document-details', documentId]);
  }

  onDelete(documentId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.documentService.removeDocumentById(documentId).subscribe(() => {
          this.documents = this.documents.filter(doc => doc.id !== documentId);
          this.totalDocuments--; // Update total count

          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Document deleted successfully!',
            showConfirmButton: false,
            timer: 2000,
            toast: true
          });
        });
      }
    });
  }

  onDownload(documentId: number, event: Event): void {
    event.stopPropagation();

    this.documentService.downloadDocument(documentId).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${documentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, (error) => {
      console.error('Error downloading document:', error);
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'There was an issue downloading the document.',
        confirmButtonColor: '#d33'
      });
    });
  }

  // Pagination logic
  get paginatedDocuments(): Document[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.documents.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalDocuments / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }
}
