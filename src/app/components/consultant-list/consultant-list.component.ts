import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConsultantService } from '../../Services/consultant.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultant-list',
  templateUrl: './consultant-list.component.html',
  styleUrls: ['./consultant-list.component.scss']
})
export class ConsultantListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'fullName', 'email', 'specialty', 'actions'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private consultantService: ConsultantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadConsultants();
  }

  loadConsultants() {
    this.consultantService.getAllConsultants().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  deleteConsultant(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "This consultant will be deleted permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.consultantService.deleteConsultant(id).subscribe({
          next: () => {
            this.loadConsultants();
            Swal.fire('Deleted!', 'Consultant has been deleted.', 'success');
          },
          error: () => {
            Swal.fire('Error!', 'Failed to delete the consultant.', 'error');
          }
        });
      }
    });
  }

  /*viewConsultations(consultantId: number) {
    this.router.navigate(['/consultant-consultations', consultantId]);
  }*/

  editConsultant(id: number) {
    this.router.navigate(['/consultant-edit', id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
