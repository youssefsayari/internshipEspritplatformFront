import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../Services/document.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';  // ✅ Import Router

@Component({
  selector: 'app-predefined-documents',
  templateUrl: './predefined-documents.component.html',
  styleUrls: ['./predefined-documents.component.scss']
})
export class PredefinedDocumentsComponent implements OnInit {
  predefinedDocuments = [
    { fileName: "lettre_affectation.pdf", displayName: "Lettre d'Affectation", type: "Lettre d'Affectation" },
    { fileName: "demande_de_stage.pdf", displayName: "Demande de Stage", type: "Demande de Stage" },
    { fileName: "journal.pdf", displayName: "Journal de Stage", type: "Journal de Stage" },
  ];

  hoveredDoc: string | null = null;
  previewUrl: SafeResourceUrl | null = null;
  showPreview = false;

  constructor(
    private documentService: DocumentService,
    private sanitizer: DomSanitizer,
    private router: Router  // ✅ Inject Router
  ) {}

  ngOnInit(): void {}

  previewDocument(fileName: string, event?: Event): void {
    if (event) event.stopPropagation();
    
    this.documentService.downloadPredefinedDocument(fileName).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.showPreview = true;
    }, error => {
      console.error('Preview failed', error);
    });
  }

  downloadDocument(fileName: string, event?: Event): void {
    if (event) event.stopPropagation();
    
    this.documentService.downloadPredefinedDocument(fileName).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download failed', error);
    });
  }

  downloadAll(): void {
    this.predefinedDocuments.forEach(doc => this.downloadDocument(doc.fileName));
  }

  closePreview(): void {
    this.showPreview = false;
    this.previewUrl = null;
  }

  // ✅ New method to navigate to the Document Upload page
  goToDocumentUpload(): void {
    this.router.navigate(['/document']);  // Adjust the route based on your routing setup
  }
  // ✅ New method to navigate to the Generate CV page
  goToGenerateCV(): void {
    this.router.navigate(['/generate-cv']);  // Adjust the route based on your routing setup
  }
}