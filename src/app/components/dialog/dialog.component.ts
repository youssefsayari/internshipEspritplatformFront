import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../Services/user.service";
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
        this.tutors = data.sort((a, b) => a.maxInternshipSupervisions - b.maxInternshipSupervisions);
      },
      error: (err) => {
        console.error('Error while fetching tutors:', err);
      }
    });
  }

  save() {
    const key = "maxInternshipSupervisions";
    const oldTutorId = this.student.idTutor;
    const newTutorId = this.selectedTutorId;

    if (newTutorId !== null) {
      this.userService.affectTutor(this.student.id, newTutorId).subscribe({
        next: () => {
          this.userService.updateTutorAdd(key, newTutorId).subscribe({
            next: () => {
              if (oldTutorId !== null) {
                this.userService.updateTutorRem(key, oldTutorId).subscribe({
                  next: () => {
                    Swal.fire('Success', 'Tutor assigned successfully', 'success');
                    this.dialogRef.close(true);
                  },
                  error: (err) => {
                    console.error('Error updating old tutor:', err);
                    Swal.fire('Error', 'Failed to update old tutor', 'error');
                  }
                });
              } else {
                Swal.fire('Success', 'Tutor assigned successfully', 'success');
                this.dialogRef.close(true);
              }
            },
            error: (err) => {
              console.error('Error updating new tutor:', err);
              Swal.fire('Error', 'Failed to update new tutor', 'error');
            }
          });
        },
        error: (err) => {
          console.error('Error assigning tutor:', err);
          Swal.fire('Error', 'Failed to assign tutor', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'New tutor ID cannot be null', 'error');
    }
  }




}
