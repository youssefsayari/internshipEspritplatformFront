import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import Swal from "sweetalert2";
import {AgreementService} from "../../Services/agreement.service";
import {AgreementRemarkService} from "../../Services/agreement-remark.service";

@Component({
  selector: 'app-agreement-dialog',
  templateUrl: './agreement-dialog.component.html',
  styleUrls: ['./agreement-dialog.component.scss']
})
export class AgreementDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AgreementDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public agreement: any, private agreementService: AgreementService, private agreementRemarkService: AgreementRemarkService) { }

  ngOnInit(): void {
  }

  acceptAgreement(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, accept it!"
    }).then((result) => {
      if (result.isConfirmed) {
        // Call the API to approve the agreement
        this.agreementService.approveAgreement(this.agreement.id).subscribe({
          next: () => {
            Swal.fire("Accepted!", "Agreement accepted successfully.", "success");
            // Update your data (e.g., remove the agreement from the list or refresh data)
          },
          error: (err) => {
            console.error("Error accepting agreement:", err);
            Swal.fire("Error!", "Failed to accept the agreement.", "error");
          }
        });
      }
    });
    this.dialogRef.close(true);
  }

  approvedAgreement(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.agreementService.acceptAgreement(this.agreement.id).subscribe({
          next: () => {
            Swal.fire("Approved!", "The agreement has been successfully approved.", "success");
          },
          error: (err) => {
            console.error("Error accepting agreement:", err);
            Swal.fire("Error!", "Failed to approve the agreement.", "error");
          }
        });
      }
    });

    this.dialogRef.close(true);
  }

  rejectAgreement(): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject it!"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Why do you reject this agreement?',
          input: 'textarea',
          inputPlaceholder: 'Write your reason here...',
          showCancelButton: true,
          confirmButtonText: 'Reject',
          preConfirm: (remark) => {
            if (remark) {
              remark = `Rejected: ${remark} - ${new Date().toLocaleDateString()}`;
            }
            const agreementRemark = {
              remark: remark,
              idAgreement: this.agreement.id
            };
            console.log('id:',agreementRemark)

            // Call API to add remark
            this.agreementRemarkService.addAgreementRemark(agreementRemark).subscribe({
              next: () => {
                // Call API to reject agreement
                this.agreementService.rejectAgreement(this.agreement.id).subscribe({
                  next: () => {
                    Swal.fire("Rejected!", "Agreement application rejected.", "success");
                  },
                  error: (err) => {
                    console.error("Error rejecting agreement:", err);
                    Swal.fire("Error!", "Failed to reject the agreement.", "error");
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
    this.dialogRef.close(true);
  }


}
