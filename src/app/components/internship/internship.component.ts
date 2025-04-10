import { Component, OnInit , ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {InternshipService} from "../../Services/internship.service";
import {UserService} from "../../Services/user.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import Swal from 'sweetalert2';
import {DialogInternshipTutorComponent} from "../dialog-internship-tutor/dialog-internship-tutor.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogRemarkComponent} from "../dialog-remark/dialog-remark.component";
import {InternshipRemarkService} from "../../Services/internship-remark.service";
import {Remark} from "../../models/remark";
import {AgreementService} from "../../Services/agreement.service";
import {AgreementDTO} from "../../models/agreement-dto";
import {TimeLineService} from "../../Services/time-line.service";
import {TimeLine} from "../../models/time-line";
import { DocumentService } from '../../Services/document.service';


@Component({
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.scss']
})
export class InternshipComponent implements OnInit {

  displayedColumnsInternship: string[] = ['title', 'description', 'internshipState', 'action'];

  displayedColumnsTutor: string[] = ['studentName', 'classe', 'title', 'internshipState','typeInternship', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isSummerInternship: boolean = false;
  isGraduationInternship: boolean = false;
  isTutor: boolean = false;
  remarks: Remark[] = [];
  userId: number;
  AgreementApproved: boolean = false;
  agreementInfo: AgreementDTO;
  timelines: TimeLine[] = [];
  private timelineApprovalStatus: boolean[] = [];
  selectedTimelineIndex: number = -1;
  constructor(private router: Router, private internshipService: InternshipService, private timeLineService: TimeLineService ,private userService: UserService,private dialog: MatDialog,
  private internshipRemarkService: InternshipRemarkService, private agreementService: AgreementService, private documentService: DocumentService) {}

  ngOnInit() {
    console.log(document.querySelector('.main-panel'));

/*ya sayari ija hezz*/
    const userRole = localStorage.getItem('userRole');
    const userClasse = localStorage.getItem('userClasse');
    const token = localStorage.getItem('Token');

    if (!token || !userRole) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }

    /*end ya sayari ija hezz*/
    if (userRole === 'Student') {
      if (userClasse && ['1', '2', '3', '4'].includes(userClasse.charAt(0))) {
        this.isSummerInternship = true;
      } else if (userClasse && userClasse.charAt(0) === '5') {
        this.isGraduationInternship = true;
      }
      this.fetchInternshipsStudent(token);
      this.fetchInternshipsStudent2(token);
    }
    if (userRole === 'Tutor') {
      this.isTutor = true;
      this.fetchInternshipsTutor(token);
    }

  }


  fetchInternshipsStudent(token: string) {
    this.userService.decodeTokenRole(token).subscribe({
      next: (userDetails) => {
        if (userDetails.id) {
          const idUser = userDetails.id;
          this.internshipService.getInternships(idUser).subscribe({
            next: (data) => {
              console.log(data);
              this.dataSource = new MatTableDataSource(data);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            },
            error: (err) => {
              console.error("Erreur lors de la récupération des stages :", err);
            }
          });
        }
      },

      error: (err) => {
        console.error("Erreur lors du décodage du token :", err);
        this.router.navigate(['/login']);
      }
    });

  }


  fetchInternshipsTutor(token: string) {
    this.userService.decodeTokenRole(token).subscribe({
      next: (userDetails) => {
        if (userDetails.id) {
          const idUser = userDetails.id;

          this.internshipService.getInternshipsForTutor(idUser).subscribe({
            next: (data) => {
              console.log("All Data :", data);
              const filteredData = data.filter((internship: any) => {
                if (internship.typeInternship === "Graduation") {
                  return internship.internshipState === "APPROVEDBYCOMPANY" || internship.internshipState === "APPROVED";
                }
                return internship.typeInternship === "Summer";
              });
              console.log("Filtered Data :", filteredData);
              this.dataSource = new MatTableDataSource(filteredData);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            },
            error: (err) => {
              console.error("Erreur lors de la récupération des stages :", err);
            }
          });
        }
      },
      error: (err) => {
        console.error("Erreur lors du décodage du token :", err);
        this.router.navigate(['/login']);
      }
    });
  }

  deleteInternship(internshipId: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.internshipService.deleteInternship(internshipId).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter(i => i.id !== internshipId);
            Swal.fire("Deleted!", "Internship application deleted successfully.", "success");
          },
          error: (err) => {
            console.error("Error deleting internship:", err);
            Swal.fire("Error!", "Failed to delete internship application.", "error");
          }
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStateLabel(state: string): string {
    switch (state) {
      case 'APPROVEDBYCOMPANY':
        return 'Approved by Company';
      case 'REJECTEDBYTUTOR':
        return 'Rejected by Tutor';
      case 'APPROVED':
        return 'Approved';
      case 'REJECTED':
        return 'Rejected';
      case 'PENDING':
        return 'Pending';
      default:
        return state;
    }
  }

  showDetails(internship: any) {
    const dialogRef = this.dialog.open(DialogInternshipTutorComponent, {
      width: '30%',
      data: {internship: internship}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with:', result);
        const token = localStorage.getItem('Token');
        this.fetchInternshipsTutor(token);
      }
    });
  }
  fetchRemarks(internshipId: number): void {
    this.internshipRemarkService.getInternshipRemarksByInternshipId(internshipId).subscribe(
      (data: Remark[]) => {
        console.log(data);
        this.remarks = data;
        this.showRemark(this.remarks);
      },
      (error) => {
        console.error('Error fetching remarks:', error);
      }
    );
  }

  showRemark(remarks) {
    console.log('Showing remarks:', remarks); // Check the structure of remarks here
    const dialogRef = this.dialog.open(DialogRemarkComponent, {
      width: '30%',
      data: { remarks: this.remarks }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with:', result);
        const token = localStorage.getItem('Token');
        this.fetchInternshipsTutor(token);
      }
    });
  }

  fetchInternshipsStudent2(token: string) {
    this.userService.decodeTokenRole(token).subscribe({
      next: (userDetails) => {
        if (userDetails.id) {
          const idUser = userDetails.id;
          this.agreementService.getAgreementByStudentId(idUser).subscribe({
            next: (agreement) => {
              this.agreementInfo = agreement;
              if (agreement.agreementState === 'APPROVED') {
                this.AgreementApproved = true;
                this.addTimelineToAgreement(idUser, this.agreementInfo.id);
                this.fetchTimelines(idUser);
              }
            },
            error: (err) => {
              if (err.status === 404) {
                console.error("Erreur lors de la récupération de l'accord :", err);
              }
            }
          });
        }
      },
      error: (err) => {
        console.error("Erreur lors du décodage du token :", err);
        this.router.navigate(['/login']);
      }
    });
  }

  addTimelineToAgreement(userId: number, agreementId: number) {
    this.timeLineService.addTimeLine(userId, agreementId).subscribe({
      next: () => {
        this.fetchTimelines(userId);
        console.log('Timeline added successfully');
      },
      error: (err) => {
        console.error('Error adding timeline:', err);
      }
    });
  }

  fetchTimelines(userId: number): void {
    this.timeLineService.getTimeLinesByUserId(userId).subscribe({
      next: (timelines) => {
        this.timelines = timelines;
        // Initialize approval status array
        this.timelineApprovalStatus = new Array(timelines.length).fill(false);
        // First item is always unlocked
        if (timelines.length > 0) {
          this.timelineApprovalStatus[0] = true;
        }
        console.log('Timeline added successfully', timelines);
      },
      error: (err) => {
        console.error('Error fetching timelines:', err);
      }
    });
  }

  isTimelineUnlocked(index: number): boolean {
    return this.timelineApprovalStatus[index];
  }

  getIcon(title: string): string {
    switch (title) {
      case 'Depot Journal de bord':
        return '📖'; // Exemple d'icône
      case 'Depot Bilan Version 1':
        return '📊'; // Exemple d'icône
      case 'Lancement Visite Mi Parcours':
        return '📍'; // Exemple d'icône
      case 'Validation Technique':
        return '✔️'; // Exemple d'icône
      case 'Depot Rapport Version 1':
        return '📑'; // Exemple d'icône
      case 'Depot Rapport Final':
        return '📜'; // Exemple d'icône
      default:
        return '🔘'; // Icône par défaut
    }
  }

  Validation(internship: any){

  }

  downloadDocument(timeline: TimeLine) {
    if (timeline.documentId) {
      this.documentService.downloadDocument(timeline.documentId).subscribe(
        (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${timeline.title}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error => {
          console.error('Error downloading document:', error);
          Swal.fire('Error', 'Failed to download document', 'error');
        }
      );
    }
  }

  onFileSelected(event: any, timeline: TimeLine) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', timeline.title);
      formData.append('userId', this.userId.toString());

      this.documentService.addDocument(formData).subscribe(
        (response: any) => {
          timeline.documentId = response.id;
          Swal.fire('Success', 'Document uploaded successfully', 'success');
        },
        error => {
          console.error('Error uploading document:', error);
          Swal.fire('Error', 'Failed to upload document', 'error');
        }
      );
    }
  }

  validateTimeline(timeline: TimeLine) {
    this.timeLineService.acceptStep(timeline.title, this.userId).subscribe(
      () => {
        const currentIndex = this.timelines.findIndex(t => t.id === timeline.id);
        if (currentIndex < this.timelines.length - 1) {
          this.timelineApprovalStatus[currentIndex + 1] = true;
        }
        Swal.fire('Success', 'Timeline step validated successfully', 'success');
      },
      error => {
        console.error('Error validating timeline:', error);
        Swal.fire('Error', 'Failed to validate timeline step', 'error');
      }
    );
  }

  rejectTimeline(timeline: TimeLine) {
    this.timeLineService.rejectStep(timeline.title, this.userId).subscribe(
      () => {
        Swal.fire('Success', 'Timeline step rejected successfully', 'success');
      },
      error => {
        console.error('Error rejecting timeline:', error);
        Swal.fire('Error', 'Failed to reject timeline step', 'error');
      }
    );
  }

  toggleTimelineDetails(index: number) {
    if (this.selectedTimelineIndex === index) {
      this.selectedTimelineIndex = -1;
    } else {
      this.selectedTimelineIndex = index;
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  onDrop(event: DragEvent, timeline: TimeLine) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.isValidFileType(file)) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', timeline.title);
        formData.append('userId', this.userId.toString());

        this.documentService.addDocument(formData).subscribe(
          (response: any) => {
            timeline.documentId = response.id;
            Swal.fire('Success', 'Document uploaded successfully', 'success');
          },
          error => {
            console.error('Error uploading document:', error);
            Swal.fire('Error', 'Failed to upload document', 'error');
          }
        );
      } else {
        Swal.fire('Error', 'Please upload only PDF or DOC files', 'error');
      }
    }
  }

  private isValidFileType(file: File): boolean {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  }

}
