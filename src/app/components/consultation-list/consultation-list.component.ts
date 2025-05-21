import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Consultation, ConsultationStatus } from '../../models/consullting';
import { ClientService } from '../../Services/client.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrls: ['./consultation-list.component.scss']
})
export class ConsultationListComponent implements OnInit {

  clientId!: number;
  dataSource!: MatTableDataSource<Consultation>;
  consultationStatus = ConsultationStatus;
  displayedColumns: string[] = ['index', 'consultant', 'startTime', 'endTime', 'status', 'meetingLink'];
  clientName!: string; 
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = Number(this.route.snapshot.paramMap.get('clientId'));
    this.loadConsultations();
  }

  loadConsultations() {
    this.clientService.getClientConsultations(this.clientId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      if (data.length > 0) {
        this.clientName = data[0].client?.fullName || 'Unknown';
      }
    });
  }

  showConsultantDetails(consultant: any) {
    Swal.fire({
      title: `<strong>${consultant?.fullName}</strong>`,
      html: `
        <p><strong>Email:</strong> ${consultant?.email}</p>
        <p><strong>Name:</strong> ${consultant?.fullName}</p>
        <p><strong>Biography:</strong><br/>${consultant?.profileDescription}</p>
        <p><strong>Specialties:</strong> ${consultant?.specialty}</p>
      `,
      icon: 'info',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'consultant-details-popup',
        title: 'consultant-details-title',
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goBack() {
    this.router.navigate(['/client-list']);
  }
}
