import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {Post} from "../../models/post";
import {PostService} from "../../services/post.service";
import {UserService} from "../../services/user.service";
import {InternshipService} from "../../services/internship.service";
import Swal from 'sweetalert2';
import {InternshipAdminResponse} from "../../models/internship-admin-response";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogInternshipComponent} from "../dialog-internship/dialog-internship.component";


@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  posts: Post[] = [];
  internships: InternshipAdminResponse[] = [];
  displayedColumns: string[];
  dataSource: MatTableDataSource<InternshipAdminResponse>;
  openedPostId: number | null = null;
  id: number;
  isAdmin: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private router: Router, private postService: PostService, private userService: UserService, private internshipService: InternshipService,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.postService.getAllPosts().subscribe((data: Post[]) => {
      this.posts = data;
    });
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('Token');

    if (!token || !userRole) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }
    if (userRole === 'Admin') {
      this.isAdmin = true;
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

  deletePost(id: number) {
    console.log(`Post deleted with ID: ${id}`);
  }

  editPost(post: any) {
    console.log('Editing post:', post);
  }

  showDetails(post: any) {
    console.log('Showing details for:', post);
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

}
