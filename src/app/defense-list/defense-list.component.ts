import { Component, OnInit } from '@angular/core';
import { DefenseService } from '../Services/defense.service';
import { Defense } from '../models/defense';
import {UserService} from "../Services/user.service";
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-defense-list',
  templateUrl: './defense-list.component.html',
  styleUrls: ['./defense-list.component.scss']
})
export class DefenseListComponent implements OnInit {
  defenses: Defense[] = [];
  page: number = 1;
  itemsPerPage: number = 5;
  totalDefenses: number = 0;
  isLoading: boolean = true;

  constructor(private defenseService: DefenseService, private router: Router,private userService: UserService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('Token');
    this.loadDefenses();
    this.fetchUser(token!);
  }

  fetchUser(token: string) {
      this.userService.decodeTokenRole(token).subscribe({
        next: (userDetails) => {
          if (userDetails.id) {
            const idUser = userDetails.id;
          }
        },
        error: (err) => {
          console.error("Erreur lors du décodage du token :", err);
          this.router.navigate(['/login']);
        }
      });
    }

  loadDefenses(): void {
    this.isLoading = true;
    this.defenseService.getAllDefenses().subscribe({
      next: (data) => {
        this.defenses = data;
        this.totalDefenses = data.length;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching defenses:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Loading Failed',
          text: 'There was an issue loading the defenses.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  viewDefenseDetails(defenseId: number): void {
    this.router.navigate(['/defense-details'], { state: { defenseId: defenseId } });  }
  
 


  onDelete(defenseId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.defenseService.deleteDefenseById(defenseId).subscribe(() => {
          this.defenses = this.defenses.filter(def => def.idDefense !== defenseId);
          this.totalDefenses--;
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Defense deleted successfully!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
    });
  }
  editDefense(defenseId: number): void {
    this.router.navigate(['/update-defense'], { state: { defenseId: defenseId } });
  }
  addDefense(): void {
    this.router.navigate(['/add-defense']);
  }

  DefenseStats(): void {
    this.router.navigate(['/defense-stats']);
  }
  
  

  get paginatedDefenses(): Defense[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.defenses.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalDefenses / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.page = page;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
  // Add this method to your DefenseListComponent
getPages(): number[] {
  // Show max 5 page numbers at a time for better UX
  const maxVisiblePages = 5;
  const half = Math.floor(maxVisiblePages / 2);
  let start = Math.max(1, this.page - half);
  let end = Math.min(this.totalPages, start + maxVisiblePages - 1);

  // Adjust if we're at the end
  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1);
  }

  return Array.from({length: end - start + 1}, (_, i) => start + i);
}
}