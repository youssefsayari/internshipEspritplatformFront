import { Component, OnInit , ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {InternshipService} from "../../services/internship.service";
import {UserService} from "../../services/user.service";
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-internship',
  templateUrl: './internship.component.html',
  styleUrls: ['./internship.component.scss']
})
export class InternshipComponent implements OnInit {
  internships: any[] = [];
  displayedColumns: string[] = ['title', 'description', 'state', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  isSummerInternship: boolean = false;
  isTutor: boolean = false;
  constructor(private router: Router, private internshipService: InternshipService,private userService: UserService) {}

  ngOnInit() {
    const userRole = localStorage.getItem('userRole');
    const userClasse = localStorage.getItem('userClasse');
    const token = localStorage.getItem('Token');

    if (!token || !userRole) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }
    if (userRole === 'Student') {
      if (userClasse && ['1', '2', '3', '4'].includes(userClasse.charAt(0))) {
        this.isSummerInternship = true;
      } else if (userClasse && userClasse.charAt(0) === '5') {
        this.isSummerInternship = false;
      }
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
    if (userRole === 'Tutor') {
      this.isTutor = true;
    }

  }

  deleteInternship(internshipId: number) {
    if (confirm("Are you sure you want to delete this internship application?")) {
      this.internshipService.deleteInternship(internshipId).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(i => i.id !== internshipId);
          alert("Internship application deleted successfully.");
        },
        error: (err) => {
          console.error("Error deleting internship:", err);
          alert("Failed to delete internship application.");
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
