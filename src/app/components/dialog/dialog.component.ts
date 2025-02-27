import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  tutors: any[] = [];
  selectedTutorId: number;
  constructor(public dialogRef: MatDialogRef<DialogComponent>,
              @Inject(MAT_DIALOG_DATA) public student: any,
              private userService: UserService) { }

  ngOnInit(): void {
    this.selectedTutorId = this.student.idTutor || null;
    this.getTutors();
  }

  getTutors() {
    this.userService.getUserBytypeUser("Tutor").subscribe({
      next: (data: any[]) => {
        this.tutors = data;
        console.log("Tutors list:", this.tutors);
      },
      error: (err) => {
        console.error('Error while fetching tutors:', err);
      }
    });
  }

  save() {
    this.userService.affectTutor(this.student.id, this.selectedTutorId).subscribe({
      next: () => {
        Swal.fire('Success', 'Tutor assigned successfully', 'success');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error assigning tutor:', err);
        Swal.fire('Error', 'Failed to assign tutor', 'error');
      }
    });
  }


}
