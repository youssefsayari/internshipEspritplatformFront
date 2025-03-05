import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../Services/user.service";
import {InternshipService} from "../../Services/internship.service";
import {DialogInternshipComponent} from "../dialog-internship/dialog-internship.component";
import Swal from "sweetalert2";
import {InternshipRemark} from "../../models/internship-remark";
import {InternshipRemarkService} from "../../Services/internship-remark.service";



@Component({
  selector: 'app-dialog-internship-tutor',
  templateUrl: './dialog-internship-tutor.component.html',
  styleUrls: ['./dialog-internship-tutor.component.scss']
})
export class DialogInternshipTutorComponent implements OnInit {
  internship: any;
  constructor(public dialogRef: MatDialogRef<DialogInternshipComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService, private internshipService: InternshipService, private internshipRemarkService: InternshipRemarkService) {
    this.internship = data.internship;
  }

  ngOnInit(): void {
  }

  AcceptInternship(internshipId: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, approve it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Why do you approve this internship?',
          input: 'textarea',
          inputPlaceholder: 'Write your reason here...',
          showCancelButton: true,
          confirmButtonText: 'Approve',
          preConfirm: (remark) => {
            if (remark) {
              remark = `Tutor[Accepted]: ${remark} - ${new Date().toLocaleDateString()}`;
            }
            const internshipRemark: InternshipRemark = {
              remark: remark,
              idInternship: internshipId
            };

            this.internshipRemarkService.addInternshipRemark(internshipRemark).subscribe({
              next: () => {
                this.internshipService.approveInternship(internshipId).subscribe({
                  next: () => {
                    Swal.fire("Approved!", "Internship application approved successfully.", "success");
                    this.dialogRef.close(true);
                  },
                  error: (err) => {
                    console.error("Error approving internship:", err);
                    Swal.fire("Error!", "Failed to approve internship application.", "error");
                  }
                });
              },
              error: (err) => {
                console.error("Error adding remark:", err);
                Swal.fire("Error!", "Failed to add remark.", "error");
              }
            });
          }
        });
      }
    });
  }


  DeniedInternship(internshipId: number) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, denied it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Why do you deny this internship?',
          input: 'textarea',
          inputPlaceholder: 'Write your reason here...',
          showCancelButton: true,
          confirmButtonText: 'Approve',
          preConfirm: (remark) => {
            if (remark) {
              remark = `Tutor[Denied]: ${remark} - ${new Date().toLocaleDateString()}`;
            }
            const internshipRemark: InternshipRemark = {
              remark: remark,
              idInternship: internshipId
            };

            this.internshipRemarkService.addInternshipRemark(internshipRemark).subscribe({
              next: () => {
                this.internshipService.rejectInternship(internshipId).subscribe({
                  next: () => {
                    Swal.fire("Denied!", "Internship application denied.", "success");
                    this.dialogRef.close(true);
                  },
                  error: (err) => {
                    console.error("Error approving internship:", err);
                    Swal.fire("Error!", "Failed to deny internship application.", "error");
                  }
                });
              },
              error: (err) => {
                console.error("Error adding remark:", err);
                Swal.fire("Error!", "Failed to add remark.", "error");
              }
            });
          }
        });
      }
    });
  }

}
