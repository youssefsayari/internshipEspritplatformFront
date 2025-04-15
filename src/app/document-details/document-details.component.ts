import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from '../Services/document.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common'; // ✅ Import Location



@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss']
})
export class DocumentDetailsComponent implements OnInit {
  document: any = null;
  pdfPreviewUrl: SafeResourceUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private location: Location // ✅ Inject Location

  ) {}

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.getDocumentDetails(+documentId); // ✅ Convert ID to number
    }
  }

  

  getDocumentDetails(id: number): void {
    this.documentService.getDocumentById(id).subscribe(
      (doc) => {
        this.document = doc;
        console.log('📄 Document Data:', doc); // ✅ Debugging

        if (doc.id) {
          this.previewDocument(doc.id); // ✅ Use ID instead of fileUrl
        } else {
          console.error('❌ No document ID found for preview');
        }
      },
      (error) => {
        console.error('⚠️ Error fetching document:', error);
      }
    );
  }

  previewDocument(documentId: number): void {
    this.documentService.downloadDocument(documentId).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        this.pdfPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      (error) => {
        console.error('⚠️ Preview failed:', error);
      }
    );
  }

  // Modified downloadDocument function to trigger file download
  downloadDocument(documentId: number): void {
    this.documentService.downloadDocument(documentId).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.document.name; // Use document name for the file download
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download failed', error);
    });
  }
  goBack() {
    this.router.navigate(['/document-list']);
  }
  
}
