import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Post} from "../../Model/Post";
import {PostService} from "../../Services/PostService";
import {UserService} from "../../Services/user.service";
import {InternshipService} from "../../Services/internship.service";
import Swal from 'sweetalert2';
import {InternshipAdminResponse} from "../../models/internship-admin-response";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {DialogInternshipComponent} from "../dialog-internship/dialog-internship.component";
import {InternshipRemarkService} from "../../Services/internship-remark.service";
import {InternshipRemark} from "../../models/internship-remark";
import {AgreementDialogComponent} from "../agreement-dialog/agreement-dialog.component";
import {AgreementService} from "../../Services/agreement.service";


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  displayedColumnsCompany: string[] = ['studentName', 'classe', 'internshipState', 'action'];
  posts: Post[] = [];
  internships: InternshipAdminResponse[] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<InternshipAdminResponse>;
  openedPostId: number | null = null;
  id: number;
  isAdmin: boolean = false;
  isCompany: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private postService: PostService, private userService: UserService,
              private internshipService: InternshipService,private dialog: MatDialog, private internshipRemarkService: InternshipRemarkService,
              private agreementService: AgreementService) { }

  ngOnInit(): void {
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('Token');
    const classe = localStorage.getItem('userClasse');
    if (!token || !userRole) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }
    if (userRole === 'Admin') {
      this.isAdmin = true;
      this.postService.getAllPostsDTO().subscribe((data: Post[]) => {
        this.posts = data;
      });
    }
    else if (userRole === 'Company') {
      this.isCompany = true;
      this.postService.getPostsByCompanyDTO(Number(classe)).subscribe((data: Post[]) => {
        this.posts = data;
      });
    }
    else {
      this.postService.getAllPostsDTO().subscribe((data: Post[]) => {
        this.posts = data;
      });
    }
  }
  adjustColumns(post: Post): void {
    if (post.typeInternship === 'Summer') {
      this.displayedColumns = ['studentName', 'classe', 'tutorName', 'internshipState', 'action'];
    } else {
      this.displayedColumns = ['studentName', 'classe', 'tutorName', 'internshipState', 'validatorName', 'action'];
    }
  }

  addInternship(postId: number): void {
    const token = localStorage.getItem('Token');
    this.userService.decodeTokenRole(token).subscribe({
      next: (userDetails) => {
        if (!userDetails.id) return;

        const internshipAddRequest = {
          idUser: userDetails.id,
          idPost: postId
        };

        this.internshipService.addInternship(internshipAddRequest).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Succès !',
              text: 'Votre demande de stage a été soumise avec succès.',
              confirmButtonColor: '#3085d6'
            });
          },
          error: (err) => {
            console.error("Erreur lors de la soumission du stage :", err);

            const errorMessage =
              err.error && typeof err.error === 'string'
                ? err.error
                : "Une erreur inattendue s'est produite.";

            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: errorMessage,
              confirmButtonColor: '#d33'
            });
          }
        });
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Impossible de récupérer les informations de l'utilisateur.",
          confirmButtonColor: '#d33'
        });
      }
    });
  }


  toggleInternships(postId: number, post: Post) {
    this.openedPostId = this.openedPostId === postId ? null : postId;
    if (this.openedPostId !== null) {
      this.getInternships(this.openedPostId, post);
    }
  }

  getInternships(openedPostId: number, post: Post): void {
    this.internshipService.getInternshipsForAdmin(openedPostId).subscribe(
      (data) => {
        this.internships = data;
        this.dataSource = new MatTableDataSource(this.internships);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.adjustColumns(post);
      },
      (error) => {
        console.error('Erreur lors de la récupération des internships:', error);
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
            this.dataSource.data = this.dataSource.data.filter(i => i.idInternship !== internshipId);
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

  openDialog(internship: any, post: any) {
    const dialogRef = this.dialog.open(DialogInternshipComponent, {
      width: '30%',
      data: {internship: internship, post : post}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with:', result);
        this.getInternships(post.id, post);
      }
    });
  }

  AcceptInternship(internshipId: number,post: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, approve it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Why do you approve this internship?',
          input: 'textarea',
          inputPlaceholder: 'Write your reason here...',
          showCancelButton: true,
          confirmButtonText: 'Approve',
          preConfirm: (remark) => {
            if (remark) {
              remark = `Company[Accepted]: ${remark} - ${new Date().toLocaleDateString()}`;
            }
            const internshipRemark: InternshipRemark = {
              remark: remark,
              idInternship: internshipId
            };

            this.internshipRemarkService.addInternshipRemark(internshipRemark).subscribe({
              next: () => {
                this.internshipService.approveInternship(internshipId).subscribe({
                  next: () => {
                    this.dataSource.data = this.dataSource.data.filter(i => i.idInternship !== internshipId);
                    Swal.fire("Approved!", "Internship application approved successfully.", "success");
                    this.getInternships(post.id, post);
                  },
                  error: (err) => {
                    console.error("Error approving internship:", err);
                    Swal.fire("Error!", "Failed to approve internship application.", "error");
                  }
                });
              },
              error: (err) => {
                console.error("Error adding remark:", err);
                Swal.fire("Error!", "Failed to add remark.", "error");
              }
            });
          }
        });
      }
    });
  }


  DeniedInternship(internshipId: number,post: any) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, denied it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Why do you deny this internship?',
          input: 'textarea',
          inputPlaceholder: 'Write your reason here...',
          showCancelButton: true,
          confirmButtonText: 'Approve',
          preConfirm: (remark) => {
            if (remark) {
              remark = `Company[Denied]: ${remark} - ${new Date().toLocaleDateString()}`;
            }
            const internshipRemark: InternshipRemark = {
              remark: remark,
              idInternship: internshipId
            };

            this.internshipRemarkService.addInternshipRemark(internshipRemark).subscribe({
              next: () => {
                this.internshipService.rejectInternship(internshipId).subscribe({
                  next: () => {
                    this.dataSource.data = this.dataSource.data.filter(i => i.idInternship !== internshipId);
                    Swal.fire("Denied!", "Internship application denied.", "success");
                    this.getInternships(post.id, post);
                  },
                  error: (err) => {
                    console.error("Error approving internship:", err);
                    Swal.fire("Error!", "Failed to deny internship application.", "error");
                  }
                });
              },
              error: (err) => {
                console.error("Error adding remark:", err);
                Swal.fire("Error!", "Failed to add remark.", "error");
              }
            });
          }
        });
      }
    });
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

  openAgreement(internship: InternshipAdminResponse): void {
    this.agreementService.getAgreementByStudentId(internship.idStudent).subscribe({
      next: (agreement) => {
        if (agreement) {
          console.log('Dialog closed',agreement);
          const dialogRef = this.dialog.open(AgreementDialogComponent, {
            width: '30%',
            data: agreement
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log('Dialog closed');
          });
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





}
