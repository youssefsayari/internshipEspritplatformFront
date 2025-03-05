import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../Services/user.service'; // Remplace par ton service User si nécessaire
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import {UserResponse} from "../../models/user-response";
import {DialogComponent} from "../dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'classe', 'nameTutor', 'action'];
  dataSource!: MatTableDataSource<any>; // Type d'éléments que tu veux afficher dans le tableau

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router: Router, private userService: UserService ,private dialog: MatDialog) {}

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userRole) {
      localStorage.clear();
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getUserBytypeUser("Student").subscribe({
      next: (data: UserResponse[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Error while fetching users:', err);
        Swal.fire('Error', 'Unable to fetch users.', 'error');
      }
    });
  }

  deleteUser(userId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUserById(userId).subscribe({
          next: () => {
            this.dataSource.data = this.dataSource.data.filter((user) => user.id !== userId);
            Swal.fire('Deleted!', 'User has been deleted successfully.', 'success');
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            Swal.fire('Error!', 'Failed to delete the user.', 'error');
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

  openDialog(student: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '30%',
      data: student
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Dialog closed with:', result);
        this.ngOnInit();
      }
    });
  }
}
