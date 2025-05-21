import { Component, OnInit, ViewChild } from '@angular/core';
import { ClientService } from '../../Services/client.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '../../models/consullting';

@Component({
  selector: 'app-list-clients',
  
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']

})
export class ListClientsComponent implements OnInit {
  displayedColumns: string[] = ['index', 'fullName', 'email', 'actions'];
  dataSource!: MatTableDataSource<Client>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  clients: Client[] = [];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this.clientService.getAllClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.dataSource = new MatTableDataSource(this.clients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to fetch clients', 'error');
      }
    });
  }

  deleteClient(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This client will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.deleteClient(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Client has been deleted.', 'success');
            this.getClients(); // refresh list
          },
          error: () => {
            Swal.fire('Error', 'Client with scheduled consultation Cannot be deleted ', 'error');
          },
        });
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
