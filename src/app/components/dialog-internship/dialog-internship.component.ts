import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../services/user.service";
import Swal from "sweetalert2";
import {InternshipService} from "../../services/internship.service";

@Component({
  selector: 'app-dialog-internship',
  templateUrl: './dialog-internship.component.html',
  styleUrls: ['./dialog-internship.component.scss']
})
export class DialogInternshipComponent implements OnInit {
  tutors1: any[] = [];
  tutors2: any[] = [];
  selectedTutorId: number;
  selectedValidatorId: number;
  constructor(public dialogRef: MatDialogRef<DialogInternshipComponent>,
              @Inject(MAT_DIALOG_DATA) public internship: any,
              private userService: UserService, private internshipService: InternshipService) { }

  ngOnInit(): void {
    this.selectedTutorId = this.internship.idTutor || null;
    this.getTutors();
  }

  getTutors() {
    this.userService.getUserBytypeUser("Tutor").subscribe({
      next: (data: any[]) => {
        this.tutors1 = data.sort((a, b) => a.maxInternshipSupervisions - b.maxInternshipSupervisions);
        this.tutors2 = data.sort((a, b) => a.maxValidatedInternships - b.maxValidatedInternships);
      },
      error: (err) => {
        console.error('Error while fetching tutors:', err);
      }
    });
  }

  save() {
    const key = "maxInternshipSupervisions";
    const key1 = "maxValidatedInternships";
    const oldTutorId = this.internship.idTutor;
    const oldValidatorId = this.internship.validator_id;
    const newTutorId = this.selectedTutorId;
    const newValidatorId = this.selectedValidatorId;

    // ================================
    // 🔥 Affectation du Nouveau Tutor
    if (newTutorId != null) {
      this.userService.affectTutor(this.internship.idInternship, newTutorId).subscribe({
        next: () => {
          console.log("Nouveau Tutor Affecté");
        },
        error: (err) => {
          console.error("Error in Tutor Affectation:", err);
          Swal.fire('Error', 'Failed to assign Tutor', 'error');
        }
      });

      this.userService.updateTutorAdd(key, newTutorId).subscribe({
        next: () => {
          console.log("Nouveau Tutor Incrementé");
        },
        error: (err) => {
          console.error("Error in New Tutor Increment:", err);
        }
      });
    }

    // 🔥 Décrémentation de l'ancien Tutor
    if (oldTutorId != null) {
      this.userService.updateTutorRem(key, oldTutorId).subscribe({
        next: () => {
          console.log("Ancien Tutor décrémenté");
        },
        error: (err) => {
          console.error("Error in Old Tutor Decrementation:", err);
        }
      });
    }

    if (newValidatorId != null) {
      this.internshipService.affectValidator(this.internship.idInternship, newValidatorId).subscribe({
        next: () => {
          console.log("Nouveau Validator Affecté");
        },
        error: (err) => {
          console.error("Error in Validator Affectation:", err);
          Swal.fire('Error', 'Failed to assign Validator', 'error');
        }
      });

      this.userService.updateTutorAdd(key1, newValidatorId).subscribe({
        next: () => {
          console.log("Nouveau Validator Incrementé");
        },
        error: (err) => {
          console.error("Error in New Validator Increment:", err);
        }
      });
    }
    if (oldValidatorId != null) {
      this.userService.updateTutorRem(key1, oldValidatorId).subscribe({
        next: () => {
          console.log("Ancien Validator décrémenté");
        },
        error: (err) => {
          console.error("Error in Old Validator Decrementation:", err);
        }
      });
    }

    Swal.fire(
      'Success',
      'Assigned successfully',
      'success'
    );
    this.dialogRef.close(true);
  }



}
