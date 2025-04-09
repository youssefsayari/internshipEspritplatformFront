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
  constructor(private router: Router, private internshipService: InternshipService, private timeLineService: TimeLineService ,private userService: UserService,private dialog: MatDialog,
  private internshipRemarkService: InternshipRemarkService, private agreementService: AgreementService) {}

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
        console.log('Timeline added successfully', timelines);
      },
      error: (err) => {
        console.error('Error fetching timelines:', err);
      }
    });
  }

}
