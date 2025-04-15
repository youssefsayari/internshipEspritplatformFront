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
import {InternshipAdminResponse} from "../../models/internship-admin-response";
import {AgreementDialogComponent} from "../agreement-dialog/agreement-dialog.component";


@Component({
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.scss']
})
export class InternshipComponent implements OnInit {

  displayedColumnsInternship: string[] = ['title', 'description', 'internshipState', 'action'];

  displayedColumnsTutor: string[] = ['studentName', 'classe', 'title', 'internshipState','typeInternship', 'role', 'action'];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isSummerInternship: boolean = false;
  isGraduationInternship: boolean = false;
  isTutor: boolean = false;
  isValidatorrr: boolean = false;
  remarks: Remark[] = [];
  userId: number;
  AgreementApproved: boolean = false;
  agreementInfo: AgreementDTO;
  agreement: any;
  timelines: TimeLine[] = [];
  private timelineApprovalStatus: boolean[] = [];
  selectedTimelineIndex: number = -1;
  selectedStudent: any;
  showStudentProcess: boolean = false;
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
        this.getAgreement(userId);
        this.timelineApprovalStatus = [];

        for (let i = 0; i < timelines.length; i++) {
          if (i === 0) {
            this.timelineApprovalStatus.push(false);
          } else {
            const previousStatus = timelines[i - 1].timeLaneState;
            if (previousStatus === 'ACCEPTED') {
              this.timelineApprovalStatus.push(false);
            } else {
              this.timelineApprovalStatus.push(true);
            }
          }
        }

        console.log('Timelines fetched successfully', timelines);
      },
      error: (err) => {
        console.error('Error fetching timelines:', err);
      }
    });
  }
  areAllTimelinesApproved(): boolean {
    return this.timelines?.length > 0 && this.timelines.every(t => t.timeLaneState === 'ACCEPTED');
  }



  isTimelineUnlocked(index: number): boolean {
    return !this.timelineApprovalStatus[index];
  }

  getIcon(title: string): string {
    switch (title) {
      case 'Agreement Request':
        return '📑';
      case 'Work Plan Submission':
        return '📖';
      case 'Technical Validation':
        return '💻';
      case 'Report Submission':
        return '📜';
      default:
        return '🔘';
    }
  }


  downloadDocument(fileName: string): void {
    const test = fileName;
    fileName = "Plan de Travail.pdf";
    this.documentService.downloadPredefinedDocument(fileName).subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if (test === 'Report Submission'){
        a.download = 'Report_Template.pdf';
      }
      else{
        a.download = fileName;
      }
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Download failed', error);
    });
  }


  validateTimeline(timeline: TimeLine, index) {
    if (timeline.title === 'Technical Validation' || timeline.title === 'Report Submission') {
      Swal.fire({
        title: 'Please enter a note for validation',
        html: '<input type="number" id="note" class="swal2-input" min="0" max="20" step="0.1">',
        showCancelButton: true,
        confirmButtonText: 'Validate',
        cancelButtonText: 'Cancel',
        preConfirm: () => {
          const note = (document.getElementById('note') as HTMLInputElement).value;
          if (!note || isNaN(Number(note))) {
            Swal.showValidationMessage('Please enter a valid number');
            return false;
          }
          return Number(note);
        }
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          const note = result.value;
          this.timeLineService.acceptStep(timeline.title, timeline.studentId, note).subscribe(
            () => {
              const currentIndex = this.timelines.findIndex(t => t.id === timeline.id);
              if (currentIndex < this.timelines.length - 1) {
                this.timelineApprovalStatus[currentIndex + 1] = true;
                this.fetchTimelines(timeline.studentId);
              }
              this.timelines[index].timeLaneState = 'ACCEPTED';
              Swal.fire('Success', 'Timeline step validated successfully', 'success');
            },
            error => {
              console.error('Error validating timeline:', error);
              Swal.fire('Error', 'Failed to validate timeline step', 'error');
            }
          );
        }
      });
    } else {
      this.timeLineService.acceptStep(timeline.title, timeline.studentId, 0).subscribe(
        () => {
          const currentIndex = this.timelines.findIndex(t => t.id === timeline.id);
          if (currentIndex < this.timelines.length - 1) {
            this.timelineApprovalStatus[currentIndex + 1] = true;
            this.fetchTimelines(timeline.studentId);
          }
          Swal.fire('Success', 'Timeline step validated successfully', 'success');
        },
        error => {
          console.error('Error validating timeline:', error);
          Swal.fire('Error', 'Failed to validate timeline step', 'error');
        }
      );
    }
  }


  rejectTimeline(timeline: TimeLine) {
    const note = 0;
    this.timeLineService.rejectStep(timeline.title, timeline.studentId, note).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Step Rejected',
          html: `Assign tasks to help the student improve.`,
          timer: 2500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/Tasks']);
        });
      },
      error => {
        console.error('Error rejecting timeline:', error);
        Swal.fire('Error', 'Failed to reject timeline step', 'error');
      }
    );
  }


  toggleTimelineDetails(index: number): void {
    this.selectedTimelineIndex = index;
  }


  private isValidFileType(file: File): boolean {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    return validTypes.includes(file.type);
  }

  getAgreement(userId): void {
    this.agreementService.getAgreementByStudentId(userId).subscribe({
      next: (agreement) => {
        if (agreement) {
          this.agreement = agreement;
        } else {
          Swal.fire({
            icon: 'info',
            title: 'No Agreement Found',
            text: 'There is currently no agreement available for this internship.',
          });
        }
      },
      error: (err) => {
        console.error('Error while fetching the agreement:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to retrieve the agreement details.',
        });
      }
    });
  }

  Validation(row: any) {
    this.selectedStudent = row;
    this.showStudentProcess = true;
    this.fetchTimelines(row.studentId);
    this.getAgreement(row.studentId);
    this.isValidatorrr = row.isValidator;
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    this.uploadDocument(file, index);
  }

  onDrop(event: DragEvent, index: number) {
    event.preventDefault();
    const file = event.dataTransfer?.files[0];
    if (file) {
      this.uploadDocument(file, index);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  uploadDocument(file: File, index: number) {
    if (file.type !== 'application/pdf') {
      Swal.fire('Invalid File', 'Only PDF documents are allowed!', 'error');
      return;
    }

    const studentId = this.timelines[index].studentId;
    const nomEtape = this.timelines[index].title
    const type = 'AUTRE';

    this.timeLineService.uploadDocument(file, type, studentId, nomEtape).subscribe({
      next: (res) => {
        this.timelines[index].documentId = res.document.id;
        Swal.fire('Success', 'Document uploaded successfully!', 'success');
      },
      error: () => {
        Swal.fire('Error', 'Failed to upload document!', 'error');
      }
    });
  }

  downloadDocumentUpl(id: number, nom : string, title: string) {
    this.timeLineService.downloadDocument(id).subscribe(response => {
      const blob = new Blob([response.body!], { type: 'application/pdf' });

      // 🔍 Lire le header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = nom+'_'+title +'.pdf';

      if (contentDisposition) {
        const match = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (match != null && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }
      console.log("Content-Disposition:", contentDisposition);
      console.log("Nom du fichier extrait:", filename);

      // 📥 Télécharger le fichier
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // 🟢 Nom dynamique ici
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }





}
